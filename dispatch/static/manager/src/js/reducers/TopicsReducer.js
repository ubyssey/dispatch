import R from 'ramda'

import * as types from '../constants/ActionTypes'

const initialState = {
  isLoading: false,
  isLoaded: false,
  ids: []
}

export default function topicsReducer(state = initialState, action) {
  switch (action.type) {
  case types.FETCH_TOPICS + '_PENDING':
    return R.merge(state, {
      isLoading: true,
      isLoaded: false
    })
  case types.FETCH_TOPICS + '_FULFILLED':
    return R.merge(state, {
      isLoading: false,
      isLoaded: true,
      ids: action.payload.results.result
    })
  default:
    return state
  }
}
