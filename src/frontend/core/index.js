import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'

import { format, to, icon } from '../vue/filters'

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueResource)

Vue.filter('format', format)
Vue.filter('to', to)
Vue.filter('icon', icon)

export {
  Vue,
  Vuex,
  VueRouter
}
