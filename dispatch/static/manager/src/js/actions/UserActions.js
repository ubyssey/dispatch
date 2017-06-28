import { replace } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import DispatchAPI from '../api/dispatch'

import { pending, fulfilled, rejected } from '../util/redux'

export function requireLogin(nextPath) {
  return function (dispatch) {
    dispatch(replace('/login'))
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

        dispatch(replace(nextPath))
      })
      .catch(() => {
        dispatch({ type: rejected(types.AUTH.GET_TOKEN) })
      })
  }
}
