import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'

import filters from '../vue/filters'

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VueResource)

Vue.use(filters)

export {
  Vue,
  Vuex,
  VueRouter
}
