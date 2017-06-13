import { push } from 'react-router-redux'
import { normalize } from 'normalizr'

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

  approve(token, id, queryAfter) {
    const form = new FormData()
    form.append('is_submission', false)

    return dispatch => {
      dispatch(() => dispatch({
        type: types.EVENTS.SAVE,
        payload: DispatchAPI.events.save(token, id, form)
          .then(json => {
            if (queryAfter) {
              dispatch(this.list(token, queryAfter))
            }
            return {
              data: normalize(json, eventSchema)
            }
          })
      }))
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
