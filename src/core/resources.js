import { Vue } from '../core'

const UserResource = Vue.resource('http://api.dev/v1/users{/userId}/resume')

export const getUserResume = function (userId) {
  return UserResource.get({ userId })
}
