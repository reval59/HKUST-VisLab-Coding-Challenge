import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'default',
      component: () => import('./views/layout/default.vue'),
      children:[
        {
          path: '',
          name: 'home',
          component: () => import('./views/home.vue')
        },
      ]
    },
  ]
})
