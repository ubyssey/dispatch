import { push } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import { tagSchema } from '../constants/Schemas'

import DispatchAPI from '../api/dispatch'

import { ResourceActions } from '../util/redux'

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

}

export default new TagsActions(
  types.TAGS,
  DispatchAPI.tags,
  tagSchema
)
