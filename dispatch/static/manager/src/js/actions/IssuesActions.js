import { push } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import { issueSchema } from '../constants/Schemas'

import DispatchAPI from '../api/dispatch'

import { ResourceActions } from '../util/redux'

class IssuesActions extends ResourceActions {

  search(query) {
    let queryObj = {}

    if (query) {
      queryObj.q = query
    }

    return dispatch => {
      dispatch(push({ pathname: '/issues/', query: queryObj }))
    }
  }

}

export default new IssuesActions(
  types.ISSUES,
  DispatchAPI.issues,
  issueSchema
)
