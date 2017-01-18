import * as types from '../constants/ActionTypes'

const initialState = {
  isLoading: false,
  isLoaded: false,
  data: []
}

export default function templatesReducer(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_TEMPLATES + '_PENDING':
      return Object.assign({}, state, {
        isLoading: true,
        isLoaded: false
      })
    case types.FETCH_TEMPLATES + '_FULFILLED':
      return Object.assign({}, state, {
        isLoading: false,
        isLoaded: true,
        data: action.payload.results.result
      })
    default:
      return state
  }
}
