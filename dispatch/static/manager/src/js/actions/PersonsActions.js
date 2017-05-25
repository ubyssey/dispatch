import { push } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import { personSchema } from '../constants/Schemas'

import DispatchAPI from '../api/dispatch'

import { ResourceActions } from '../util/redux'

class PersonsActions extends ResourceActions {

  search(query) {
    let queryObj = {}

    if (query) {
      queryObj.q = query
    }

    return dispatch => {
      dispatch(push({ pathname: '/persons/', query: queryObj }))
    }
  }

}

export default new PersonsActions(
  types.PERSONS,
  DispatchAPI.persons,
  personSchema
)
