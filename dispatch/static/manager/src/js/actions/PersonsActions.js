import { push } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import { personSchema } from '../constants/Schemas'

import DispatchAPI from '../api/dispatch'

import { ResourceActions } from '../util/redux'

import { pending, fulfilled, rejected } from '../util/redux'

class PersonsActions extends ResourceActions {

  search(query) {
    let queryObj = {}

    if (query) {
      queryObj.q = query
    }

    return dispatch => {
      dispatch(push({ pathname: '/persons/', query: queryObj }))
    }
  }

  getUser(token, id) {
    return (dispatch) => {
      dispatch({ type: pending(types.PERSONS.GET_USER) })

      return DispatchAPI.persons.getUser(token, id)
        .then((response) => {
          dispatch({
            type: fulfilled(types.PERSONS.GET_USER),
            payload: response
          })
        })
        .catch(() => {
          dispatch({ type: rejected(types.PERSONS.GET_USER) })
        })
    }
  }

  setUser(user) {
    return (dispatch) => {
      dispatch({
        type: types.PERSONS.SET_USER,
        user: user
      })
    }
  }

  getInvite(token, id) {
    return (dispatch) => {
      dispatch({ type: pending(types.PERSONS.GET_INVITE) })

      return DispatchAPI.persons.getInvite(token, id)
        .then((response) => {
          dispatch({
            type: fulfilled(types.PERSONS.GET_INVITE),
            payload: response
          })
        })
        .catch(() => {
          dispatch({ type: rejected(types.PERSONS.GET_INVITE) })
        })
    }
  }

  setInvite(invite) {
    return (dispatch) => {
      dispatch({
        type: types.PERSONS.SET_INVITE,
        invite: invite
      })
    }
  }


}

export default new PersonsActions(
  types.PERSONS,
  DispatchAPI.persons,
  personSchema
)
