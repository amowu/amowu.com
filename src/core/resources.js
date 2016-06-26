import { Vue } from '../core'
import { API_INVOKE_URL } from './config'

Vue.http.options.root = API_INVOKE_URL

export const getUserResume = function (userId) {
  return Vue.http.get('users{/userId}/resume', { userId })
}
