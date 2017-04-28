import { push } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import DispatchAPI from '../api/dispatch'
import { fileSchema } from '../constants/Schemas'

import GenericActions from './GenericActions'

class FilesActions extends GenericActions {

  search(query) {
    var queryObj = {}

    if (query) {
      queryObj.q = query
    }

    return function(dispatch) {
      dispatch(push({ pathname: '/files/', query: queryObj }))
    }
  }

}

export default new FilesActions(
  types.FILES,
  DispatchAPI.files,
  fileSchema
)
