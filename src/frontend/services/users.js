import resource from '../core/resource'

export const getUserResume = function (userId) {
  const jwtHeader = { 'Authorization': `Bearer ${localStorage.getItem('id_token')}` }
  return resource.get(`users/${userId}/resume`, {}, {
    headers: jwtHeader
  })
}
