<template>

  <maApp
    :fixedSidebar="true"
    :fixedFooter="true"
  >
    <AppHeader></AppHeader>

    <AppSidebar></AppSidebar>

    <article class="content">
      <router-view></router-view>
    </article>

    <AppFooter></AppFooter>

  </maApp>

</template>

<script>
  import AppHeader from './app/Header'
  import AppSidebar from './app/Sidebar'
  import AppFooter from './app/Footer'

  export default {
    name: 'app',
    components: {
      AppHeader,
      AppSidebar,
      AppFooter
    }
  }
</script>
