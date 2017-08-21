import { replace } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import DispatchAPI from '../api/dispatch'
import { userSchema } from '../constants/Schemas'
import { ResourceActions } from '../util/redux'

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
    dispatch({ type: pending(types.AUTH.CREATE_TOKEN) })

    return DispatchAPI.auth.getToken(email, password)
      .then((response) => {
        dispatch({
          type: fulfilled(types.AUTH.CREATE_TOKEN),
          token: response.token,
          email: email
        })

        dispatch(replace(nextPath))
      })
      .catch((error) => {
        dispatch({
          type: rejected(types.AUTH.CREATE_TOKEN),
          error
        })
      })
  }
}

export function verifyToken(token) {
  return (dispatch) => {
    dispatch({ type: pending(types.AUTH.VERIFY_TOKEN )})

    return DispatchAPI.auth.verifyToken(token)
      .then((response) => {
        dispatch({
          type: fulfilled(types.AUTH.VERIFY_TOKEN),
          response
        })
      })
      .catch((response) => {
        dispatch({
          type: rejected(types.AUTH.VERIFY_TOKEN),
          response
        })
        dispatch(requireLogin('/'))
      })
  }
}

export function logoutUser(token) {
  return (dispatch) => {
    dispatch({ type: pending(types.AUTH.DELETE_TOKEN) })

    return DispatchAPI.auth.logout(token)
      .then(() => {
        dispatch({
          type: fulfilled(types.AUTH.DELETE_TOKEN)
        })

        dispatch(replace('/login'))
        dispatch({
          type: types.AUTH.LOGIN_REQUIRED,
          nextPath: '/'
        })
      })
      .catch(() => {
        dispatch({ type: rejected(types.AUTH.DELETE_TOKEN)})
      })
  }
}

export default new ResourceActions(
  types.USERS,
  DispatchAPI.users,
  userSchema
)
