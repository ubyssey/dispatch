import { push } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import DispatchAPI from '../api/dispatch'

import { pending, fulfilled, rejected } from '../util/redux'

export function requireLogin(nextPath) {
  return function (dispatch) {
    dispatch(push('/login'))
    dispatch({
      type: types.AUTH.LOGIN_REQUIRED,
      nextPath: nextPath
    })
  }
}

export function authenticateUser(email, password, nextPath = '/') {
  return (dispatch) => {
    dispatch({ type: pending(types.AUTH.GET_TOKEN) })

    return DispatchAPI.auth.getToken(email, password)
      .then((response) => {
        dispatch({
          type: fulfilled(types.AUTH.GET_TOKEN),
          token: response.token,
          email: email
        })

        dispatch(push(nextPath))
      })
      .catch(() => {
        dispatch({ type: rejected(types.AUTH.GET_TOKEN) })
      })
  }
}

export function unauthenticateUser(nextPath = '/') {
  return dispatch => {
    //TODO: hook up the API call
  }
}
