import { push } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import { topicSchema } from '../constants/Schemas'

import DispatchAPI from '../api/dispatch'

import { ResourceActions } from '../util/redux'

class TopicsActions extends ResourceActions {

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
