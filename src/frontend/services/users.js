import resource from '../core/resource'

export const getUserResume = function (userId) {
  return resource.get(`users/${userId}/resume`)
}
