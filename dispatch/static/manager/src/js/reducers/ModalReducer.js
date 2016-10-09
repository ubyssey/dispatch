import * as types from '../constants/ActionTypes'

const initialState = {
  component: null,
  props: {}
}

export default function modalReducer(state = initialState, action) {
  switch (action.type) {
    case types.OPEN_MODAL:
      return {
        component: action.component,
        props: action.props
      }
    case types.CLOSE_MODAL:
      return initialState
    default:
      return state
  }
}
