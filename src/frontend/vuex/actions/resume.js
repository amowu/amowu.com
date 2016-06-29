import { getUserResume } from '../../vue/resources'
import { FETCH_USER_RESUME_SUCCESS } from '../const'

export const fetchUserResume = function ({ dispatch }, userId) {
  getUserResume(userId).then(response => {
    dispatch(FETCH_USER_RESUME_SUCCESS, response.data)
  })
}
