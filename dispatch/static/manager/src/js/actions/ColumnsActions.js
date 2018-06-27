import { push } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import { columnSchema } from '../constants/Schemas'

import DispatchAPI from '../api/dispatch'

import { ResourceActions } from '../util/redux'

class ColumnsActions extends ResourceActions {

  search(query) {
    let queryObj = {}

    if (query) {
      queryObj.q = query
    }

    return dispatch => {
      dispatch(push({ pathname: '/columns/', query: queryObj }))
    }
  }

}

export default new ColumnsActions(
  types.COLUMNS,
  DispatchAPI.columns,
  columnSchema
)
