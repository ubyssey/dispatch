import { push } from 'react-router-redux'
import { normalize } from 'normalizr'

import * as types from '../constants/ActionTypes'
import { topicSchema } from '../constants/Schemas'

import DispatchAPI from '../api/dispatch'

import { ResourceActions, pending, fulfilled, rejected} from '../util/redux'

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

  createAndAdd(token, data, callback) {
    return (dispatch) => {

      dispatch({ type: pending(types.TOPICS.CREATE) })

      DispatchAPI.topics.create(token, data)
        .then(json => {
          dispatch({
            type: fulfilled(types.TOPICS.CREATE),
            payload: {
              data: normalize(json, topicSchema)
            }
          })
          callback(json.id)
        })
        .catch(error => {
          dispatch({
            type: rejected(types.TOPICS.CREATE),
            payload: error
          })
        })
    }
  }

}

export default new TopicsActions(
  types.TOPICS,
  DispatchAPI.topics,
  topicSchema
)
