import Vue from 'vue'
import './plugins/vuetify'
import './plugins/d3'
import './plugins/axios'
import './plugins/lodash'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

