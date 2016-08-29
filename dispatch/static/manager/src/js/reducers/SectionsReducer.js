import * as types from '../constants/ActionTypes'

const initialState = {
  isLoading: false,
  isLoaded: false,
  data: []
}

export default function sectionsReducer(state = initialState, action) {
  switch (action.type) {
    case types.SECTIONS_REQUEST:
      return Object.assign({}, state, {
        isLoading: true,
        isLoaded: false
      })
    case types.SECTIONS_RECEIVE:
      return Object.assign({}, state, {
        isLoading: false,
        isLoaded: true,
        data: action.sections
      })
    default:
      return state
  }
}
