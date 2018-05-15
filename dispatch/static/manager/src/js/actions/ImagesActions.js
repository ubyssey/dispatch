import { push } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import { imageSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

import { ResourceActions } from '../util/redux'

class ImagesActions extends ResourceActions {

  toRemote(data) {
    data.author_ids = data.authors
    return data
  }
  
  search(query) {
    let queryObj = {}

    if (query) {
      queryObj.q = query
    }

    return (dispatch) => {
      dispatch(push({ pathname: '/images/', query: queryObj }))
    }
  }
  
}

export default new ImagesActions(
  types.IMAGES,
  DispatchAPI.images,
  imageSchema
)
