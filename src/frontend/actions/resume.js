import { getUserResume } from '../services/users'
import {
  FETCH_USER_RESUME_ERROR,
  FETCH_USER_RESUME_START,
  FETCH_USER_RESUME_SUCCESS
} from '../core/type'
import makeRequest from '../utils/makeRequest'

/** GET /users/:userId/resume */
export const fetchUserResume = makeRequest(
  getUserResume,
  FETCH_USER_RESUME_START,
  FETCH_USER_RESUME_SUCCESS,
  FETCH_USER_RESUME_ERROR
)
