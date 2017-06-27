import { push } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import { eventSchema } from '../constants/Schemas'

import DispatchAPI from '../api/dispatch'

import { ResourceActions } from '../util/redux'

class EventsActions extends ResourceActions {

  search(query) {
    let queryObj = {}

    if (query) {
      queryObj.q = query
    }

    return dispatch => {
      dispatch(push({ pathname: '/events/', query: queryObj }))
    }
  }

  countPending(token) {
    return {
      type: types.EVENTS.COUNT_PENDING,
      payload: DispatchAPI.events.list(token, { pending: 1, limit: 0 })
        .then(json => json.count)
    }
  }

}

export default new EventsActions(
  types.EVENTS,
  DispatchAPI.events,
  eventSchema
)
