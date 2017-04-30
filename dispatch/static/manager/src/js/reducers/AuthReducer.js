import R from 'ramda'
import Cookies from 'js-cookie'

import * as types from '../constants/ActionTypes'

import { Reducer, fulfilled } from '../util/redux'

const initialState = {
  token: Cookies.get('token'), // Get token stored in browser cookie
  email: Cookies.get('email'), // Get email stored in browser cookie
  nextPath: null
}

let reducer = new Reducer(initialState)

reducer.handle(types.AUTH.LOGIN_REQUIRED, (state, action) => {
  return R.merge(state, {
    nextPath: action.nextPath
  })
})

reducer.handle(fulfilled(types.AUTH.GET_TOKEN), (state, action) => {

  console.log('Logged in')

  Cookies.set('token', action.token) // Persist token in browser cookie
  Cookies.set('email', action.email) // Persist email in browser cookie

  return R.merge(state, {
    token: action.token,
    email: action.email,
    nextPath: null
  })
})

export default reducer.getReducer()
