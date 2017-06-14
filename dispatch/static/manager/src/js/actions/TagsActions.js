import { push } from 'react-router-redux'
import { normalize } from 'normalizr'

import * as types from '../constants/ActionTypes'
import { tagSchema } from '../constants/Schemas'

import DispatchAPI from '../api/dispatch'

import { ResourceActions, pending, fulfilled, rejected} from '../util/redux'

class TagsActions extends ResourceActions {

  search(query) {
    let queryObj = {}

    if (query) {
      queryObj.q = query
    }

    return dispatch => {
      dispatch(push({ pathname: '/tags/', query: queryObj }))
    }
  }

  createAndAdd(token, data, callback) {
    return (dispatch) => {

      dispatch({ type: pending(types.TAGS.CREATE) })

      DispatchAPI.tags.create(token, data)
        .then(json => {
          dispatch({
            type: fulfilled(types.TAGS.CREATE),
            payload: {
              data: normalize(json, tagSchema)
            }
          })
          callback(json.id)
        })
        .catch(error => {
          dispatch({
            type: rejected(types.TAGS.CREATE),
            payload: error
          })
        })
    }
  }

}

export default new TagsActions(
  types.TAGS,
  DispatchAPI.tags,
  tagSchema
)
