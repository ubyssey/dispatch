import { push } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import DispatchAPI from '../api/dispatch'
import { fileSchema } from '../constants/Schemas'

import { ResourceActions } from '../util/redux'

class FilesActions extends ResourceActions {

  search(query) {
    let queryObj = {}

    if (query) {
      queryObj.q = query
    }

    return (dispatch) => {
      dispatch(push({ pathname: '/files/', query: queryObj }))
    }
  }

}

export default new FilesActions(
  types.FILES,
  DispatchAPI.files,
  fileSchema
)
