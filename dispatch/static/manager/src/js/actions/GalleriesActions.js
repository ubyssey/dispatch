import { push } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import { gallerySchema } from '../constants/Schemas'

import DispatchAPI from '../api/dispatch'

import { ResourceActions } from '../util/redux'

class GalleriesActions extends ResourceActions {

  search(query) {
    let queryObj = {}

    if (query) {
      queryObj.q = query
    }

    return dispatch => {
      dispatch(push({ pathname: '/galleries/', query: queryObj }))
    }
  }

}

export default new GalleriesActions(
  types.GALLERIES,
  DispatchAPI.galleries,
  gallerySchema
)
