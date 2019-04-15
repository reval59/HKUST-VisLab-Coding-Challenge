import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import('./views/layout/default.vue'),
      children:[
        {
          path: '',
          name: 'home',
          component: () => import('./views/home.vue')
        },
        {
          path: 'level1',
          name: 'level1',
          component: () => import('./views/level1.vue')
        },
        {
          path: 'level2',
          name: 'level2',
          component: () => import('./views/level2.vue')
        },
        {
          path: 'level3',
          name: 'level3',
          component: () => import('./views/level3.vue')
        }
      ]
    },
  ]
})
