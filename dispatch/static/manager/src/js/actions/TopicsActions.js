import { push } from 'react-router-redux'
import { normalize, arrayOf } from 'normalizr'

import * as types from '../constants/ActionTypes'
import { topicSchema } from '../constants/Schemas'

import DispatchAPI from '../api/dispatch'

import { ResourceActions } from '../util/redux'

class TopicsActions extends ResourceActions {

  listNav(token) {
    return {
      type: this.types.LIST_NAV,
      payload: this.api.list(token)
        .then(json => ({
          data: normalize(json.results, arrayOf(this.schema))
        }))
    }
  }

  search(query) {
    let queryObj = {}

    if (query) {
      queryObj.q = query
    }

    return dispatch => {
      dispatch(push({ pathname: '/topics/', query: queryObj }))
    }
  }

}

export default new TopicsActions(
  types.TOPICS,
  DispatchAPI.topics,
  topicSchema
)
