import R from 'ramda';

import * as types from '../constants/ActionTypes'

// Dashboard actions
// export const FETCH_ACTIONS = 'FETCH_ACTIONS'
// export const FETCH_RECENT = 'FETCH_RECENT'

const initialState = {
  isLoading: false,
  isLoaded: false,
  data: []
}

let counter = 0

let DashboardReducer = (state = initialState, action) => {
  switch(action.type) {
    case `${types.FETCH_ACTIONS}_PENDING`:
      return R.merge(state,{
        isLoading: true
      })
    case `${types.FETCH_ACTIONS}_FULFILLED`:
      return R.merge(state,{
        isLoading: false,
        isLoaded: true,
        data: action.payload.results
      })
    default:
      return state
  }
}

export default DashboardReducer
