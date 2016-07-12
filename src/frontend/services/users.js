import resource from '../core/resource'
import { getAuthHeader } from '../utils/resource'

export const getUserResume = function (userId) {
  return resource.get(`users/${userId}/resume`, {}, {
    headers: getAuthHeader()
  })
}
