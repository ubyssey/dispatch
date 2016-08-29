import Cookies from 'js-cookie'

import * as types from '../constants/ActionTypes'

const initialState = {
  token: Cookies.get('token'),  // Get token stored in browser cookie
  email: Cookies.get('email'),  // Get email stored in browser cookie
  nextPath: null
}

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case types.AUTH_REQUIRED:
      return Object.assign({}, state, {
        nextPath: action.nextPath
      })
    case types.AUTH_RECEIVE_TOKEN:
      Cookies.set('token', action.token) // Persist token in browser cookie
      Cookies.set('email', action.email) // Persist email in browser cookie

      return Object.assign({}, state, {
        token: action.token,
        email: action.email,
        nextPath: null
      })
    default:
      return state
  }
}
