import * as types from '../constants/ActionTypes'

const initialState = {
  isLoading: false,
  isLoaded: false,
  data: []
}

export default function topicsReducer(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_TOPICS + '_PENDING':
      return Object.assign({}, state, {
        isLoading: true,
        isLoaded: false
      })
    case types.FETCH_TOPICS + '_FULFILLED':
      return Object.assign({}, state, {
        isLoading: false,
        isLoaded: true,
        data: action.payload.results.result
      })
    default:
      return state
  }
}
