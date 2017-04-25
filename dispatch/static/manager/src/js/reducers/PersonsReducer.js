import R from 'ramda'

import * as types from '../constants/ActionTypes'

const initialState = {
  isLoading: false,
  isLoaded: false,
  ids: []
}

export default function personsReducer(state = initialState, action) {
  switch (action.type) {
  case types.FETCH_PERSONS + '_PENDING':
    return R.merge(state, {
      isLoading: true,
      isLoaded: false
    })
  case types.FETCH_PERSONS + '_FULFILLED':
    return R.merge(state, {
      isLoading: false,
      isLoaded: true,
      ids: action.payload.results.result
    })
  default:
    return state
  }
}
