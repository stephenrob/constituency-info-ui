import Vue from 'vue'
import Router from 'vue-router'
import Form from '@/components/Form'
import Display from '@/components/Display'
import Layout from '@/layouts/App'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: Layout,
      children: [{path: '/add', name: 'add', component: Form}, {path: '/', name: 'display', component:Display}]
    }
  ]
})
