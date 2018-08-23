import * as types from '../constants/ActionTypes'

import { Reducer } from '../util/redux'

const initialState = {
  showProgress: false,
  progress: 0
}

let reducer = new Reducer(initialState)

reducer.handle(types.UPLOAD_START, () => {
  return {
    showProgress: true,
    progress: 0
  }
})

reducer.handle(types.UPLOAD_PROGRESS, (state, action) => {
  return {
    showProgress: true,
    progress: action.progress
  }
})

reducer.handle(types.UPLOAD_COMPLETE, () => {
  return {
    showProgress: false,
    progress: 0
  }
})

export default reducer.getReducer()
