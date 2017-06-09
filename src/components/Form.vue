<template>

  <div>
    <div class="title-block">
      <div class="col-xs-12 col-sm-12 col-lg-9 col-xl-9 request-header">
        <h3 class="title">Constituency Voter Count - {{ constituency.name }}</h3>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-12 form-group">
        <multiselect v-model="constituency" placeholder="Select Constituency" :options="constituencies" track-by="id" label="name" :allow-empty="false"></multiselect>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <h2 v-if="constituencyCandidates.length != 0 && constituencyTotalVotes" class="text-xs-center">Seat Won By: {{ constituencyCandidates[0].name }}, {{ constituencyCandidates[0].party }}</h2>
      </div>
      <div class="col-sm-12">
        <div class="form-group">
          <h4 class="text-xs-center">Total votes cast in constituency: {{ constituencyTotalVotes }}</h4>
        </div>
      </div>
      <div class="col-sm-12">
        <table class="table table-striped">
          <thead>
          <tr>
            <th>Candidate Name</th>
            <th>Party</th>
            <th>Votes</th>
            <th>% of Votes</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="candidate in constituencyCandidates" track-by="id">
            <th scope="row">{{ candidate.name }}</th>
            <td>{{ candidate.party }}</td>
            <td><input type="text" :id="candidate.id + '_votes'" v-model="candidate.votes"></td>
            <td>{{ candidate.votePercentage }}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="col-sm-12">
        <button class="btn btn-primary pull-right" v-on:click.stop.prevent="updateVotes">Store Votes</button>
      </div>
    </div>

  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect'
  import axios from 'axios'
export default {
  name: 'add-new',
  components: {
      Multiselect
  },
  data () {
      return {
        temp: axios,
        constituencies: [],
        constituency: {id: 0, name: 'Not Selected'},
        constituencyTotalVotes: null,
        constituencyCandidates: []
      }
  },
  methods: {
      calculateVotePercentage (candidate) {
          if (candidate.votes === null) {
              return 'No votes'
          }
          return (candidate.votes / this.constituencyTotalVotes * 100) +'%'
      },
    updateVotes () {

          let votes = {}
          let totalVotes = 0

          this.constituencyCandidates.forEach((c) => {
              votes[c.id] = c.votes
            totalVotes += parseInt(c.votes)
          })

          let data = {
            constituency: {
              id: this.constituency.id,
              totalVotes: totalVotes,
              votes: votes
            }
          }

          let voteUrl = 'https://dev-ge.staging.dmao.org/constituency/' + this.constituency.codes.gss + '/votes'

          axios.post(voteUrl, data).then((r) => {
              let response = r.data.data
            this.constituencyTotalVotes = response["totalVotes"]
            this.constituencyCandidates.forEach((c) => {
              c.votes = response.votes[c.id]
              c.votePercentage = this.calculateVotePercentage(c)
            })
            this.constituencyCandidates.sort((a, b) => b.votes - a.votes)
          }).catch((error) => console.log(error))
    }
  },
  mounted () {
    let url = 'https://mapit.mysociety.org/areas/WMC'
    axios.get(url).then((response) => {
        let consts = response.data
        Object.keys(consts).forEach((cid) => this.constituencies.push(consts[cid]))
    })
  },
  watch: {
    constituency: function (constituency) {
      let candidates = 'https://dev-ge.staging.dmao.org/constituency/' + constituency.codes.gss + '/candidates'
      let votes = 'https://dev-ge.staging.dmao.org/constituency/' + constituency.codes.gss + '/votes'
      axios.get(candidates).then((response) => {
        this.constituencyCandidates = response.data.candidates
        axios.get(votes).then((response) => {
          this.constituencyTotalVotes = response.data.data["totalVotes"]
          this.constituencyCandidates.forEach((c) => {
                c.votes = response.data.data.votes[c.id]
            c.votePercentage = this.calculateVotePercentage(c)
          })
          this.constituencyCandidates.sort((a, b) => b.votes - a.votes)
        }).catch((error) => console.log(error))
      }).catch(() => alert('Error retrieving candidates for ' + this.constituency.name))
    },
    constituencyCandidates: function (candidates) {
        candidates.forEach((c) => {
            c.votePercentage = this.calculateVotePercentage(c)
        })
      this.constituencyCandidates = candidates
    }
  }
}
</script>

<style>
</style>
