import R from 'ramda';

import * as types from '../constants/ActionTypes'

const initialState = {
  isLoading: false,
  isLoaded: false,
  files: {
    data:[]
  }
}

function filesReducer(state = initialState, action) {
  switch(action.type) {
    case types.FETCH_FILES + '_PENDING':
      return R.merge(state, {
        isLoading: true,
        isLoaded: false
      })
    case types.FETCH_FILES + '_FULFILLED':
      return R.merge(state, {
        isLoading: false,
        isLoaded: true,
        data: action.payload.results.result
      })
    default:
      return state
  }
}

export default filesReducer
