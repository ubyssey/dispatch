import { replace } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import DispatchAPI from '../api/dispatch'
import { userSchema } from '../constants/Schemas'
import { ResourceActions } from '../util/redux'

import { pending, fulfilled, rejected } from '../util/redux'

class UserActions extends ResourceActions {

  requireLogin(nextPath) {
    return function (dispatch) {
      dispatch(replace('/login'))
      dispatch({
        type: types.AUTH.LOGIN_REQUIRED,
        nextPath: nextPath
      })
    }
  }

  authenticateUser(email, password, nextPath = '/') {
    return (dispatch) => {
      dispatch({ type: pending(types.AUTH.CREATE_TOKEN) })

      return DispatchAPI.auth.getToken(email, password)
        .then((response) => {
          dispatch({
            type: fulfilled(types.AUTH.CREATE_TOKEN),
            token: response.token,
            email: email,
            settings: response.settings
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

  verifyToken(token) {
    return (dispatch) => {
      dispatch({ type: pending(types.AUTH.VERIFY_TOKEN )})

      return DispatchAPI.auth.verifyToken(token)
        .then((response) => {
          dispatch({
            type: fulfilled(types.AUTH.VERIFY_TOKEN),
            settings: response.settings,
            response
          })
        })
        .catch((response) => {
          dispatch({
            type: rejected(types.AUTH.VERIFY_TOKEN),
            response
          })
          dispatch(this.requireLogin('/'))
        })
    }
  }

  logoutUser(token) {
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

  resetPassword(token, userId) {
    return (dispatch) => {
      dispatch({ type: pending(types.USERS.RESET_PASSWORD) })

      return DispatchAPI.users.resetPassword(token, userId)
        .then(() => {
          dispatch({
            type: fulfilled(types.USERS.RESET_PASSWORD)
          })
        })
        .catch(() => {
          dispatch({ type: rejected(types.USERS.RESET_PASSWORD)})
        })
    }
  }
}

export default new UserActions(
  types.USERS,
  DispatchAPI.users,
  userSchema
)
