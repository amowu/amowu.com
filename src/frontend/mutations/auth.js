import {
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  SET_AUTHENTICATED
} from '../core/type'

const state = {
  authenticated: false
}

const mutations = {
  [LOGIN_SUCCESS] (state) {
    state.authenticated = true
  },
  [LOGOUT_SUCCESS] (state) {
    state.authenticated = false
  },
  [SET_AUTHENTICATED] (state, authenticated) {
    state.authenticated = authenticated
  }
}

export default {
  state,
  mutations
}
