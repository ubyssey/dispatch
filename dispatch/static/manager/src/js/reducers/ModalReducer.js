import * as types from '../constants/ActionTypes'

import { Reducer } from '../util/redux'

const initialState = {
  component: null,
  props: {}
}

let reducer = new Reducer(initialState)

reducer.handle(types.MODAL.OPEN, (state, action) => ({
  component: action.component,
  props: action.props
}))

reducer.handle(types.MODAL.CLOSE, () => initialState)

export default reducer.getReducer()
