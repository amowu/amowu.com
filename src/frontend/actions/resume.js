import { getUserResume } from '../services/users'
import {
  FETCH_USER_RESUME_ERROR,
  FETCH_USER_RESUME_START,
  FETCH_USER_RESUME_SUCCESS
} from '../core/type'

function makeRequest (resource, startType, successType, errorType) {
  return ({ dispatch }, ...args) => {
    dispatch(startType)
    return resource(...args)
      .then(response => dispatch(successType, response, ...args))
      .catch(response => {
        dispatch(errorType, response, ...args)
        return Promise.reject()
      })
  }
}

/** GET /users/:userId/resume */
export const fetchUserResume = makeRequest(
  getUserResume,
  FETCH_USER_RESUME_START,
  FETCH_USER_RESUME_SUCCESS,
  FETCH_USER_RESUME_ERROR
)
