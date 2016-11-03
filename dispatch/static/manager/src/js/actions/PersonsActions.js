import * as types from '../constants/ActionTypes'
import { personSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

import { normalize, arrayOf } from 'normalizr'

export function fetchPersons(token, query) {
  return {
    type: types.FETCH_PERSONS,
    payload: DispatchAPI.persons.fetchPersons(token, query)
      .then(function(json) {
        return {
          count: json.count,
          results: normalize(json.results, arrayOf(personSchema))
        }
      })
  }
}

export function createPersonHelper(person) {
  return {
    type: types.CREATE_PERSON + '_FULFILLED',
    payload: normalize(person, personSchema)
  }
}

export function createPerson(token, fullName) {
  return function(dispatch) {
    DispatchAPI.persons.createPerson(token, fullName)
      .then( person => {
        dispatch(createPersonHelper(person))
      })
  }
}
