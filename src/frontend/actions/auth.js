import Auth0Lock from 'auth0-lock'

import {
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  SET_AUTHENTICATED
} from '../core/type'

const lock = new Auth0Lock('oEmGgFwDWAwQeu3y1qSWgxqFkrmlNduZ', 'amowu.auth0.com')

export const checkAuth = ({ dispatch }, ...args) => {
  if (localStorage.getItem('id_token')) {
    dispatch(SET_AUTHENTICATED, true)
  } else {
    dispatch(SET_AUTHENTICATED, false)
  }
}

export const login = ({ dispatch }, ...args) => {
  lock.show({
    connections: ['Username-Password-Authentication'],
    dict: 'zh-TW',
    focusInput: true,
    icon: 'https://cdn.amowu.com/auth0icon.0ade39b0-c1fa-4fd5-9c85-2ecdc6a1120b.png',
    rememberLastLogin: false
  }, (err, profile, token) => {
    if (err) {
      // Handle the error
      console.error(err)
    } else {
      // Set the token and user profile in local storage
      localStorage.setItem('profile', JSON.stringify(profile))
      localStorage.setItem('id_token', token)
      dispatch(LOGIN_SUCCESS)
    }
  })
}

export const logout = ({ dispatch }, ...args) => {
  localStorage.removeItem('id_token')
  localStorage.removeItem('profile')
  dispatch(LOGOUT_SUCCESS)
}
