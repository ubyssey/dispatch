import * as types from '../constants/ActionTypes'
import Cookies from 'js-cookie'

const initialState = {
  token: Cookies.get('token'), // Get token stored in browser cookie
  user: {},
  sections: []
}

export default function appReducer(state = initialState, action) {
  switch (action.type) {
    case types.AUTH_REQUIRED:
      return Object.assign({}, state, {
        nextPath: action.nextPath
      })
    case types.AUTH_REQUEST_TOKEN:
      return state
    case types.AUTH_RECEIVE_TOKEN:
      Cookies.set('token', action.token) // Persist token in browser cookie
      return Object.assign({}, state, {
        token: action.token,
        user: {
          email: action.email
        },
        nextPath: null
      })
    case types.AUTH_FAILURE_TOKEN:
      return state
    default:
      return state
  }
}
