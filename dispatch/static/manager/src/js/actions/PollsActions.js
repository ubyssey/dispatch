import { push } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import { pollSchema } from '../constants/Schemas'

import DispatchAPI from '../api/dispatch'

import { ResourceActions } from '../util/redux'

class PollsActions extends ResourceActions {

  search(query) {
    let queryObj = {}

    if (query) {
      queryObj.q = query
    }

    return dispatch => {
      dispatch(push({ pathname: '/polls/', query: queryObj }))
    }
  }

}

export default new PollsActions (
  types.POLLS,
  DispatchAPI.polls,
  pollSchema
)
