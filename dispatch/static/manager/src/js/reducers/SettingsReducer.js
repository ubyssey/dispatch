import R from 'ramda'

import * as types from '../constants/ActionTypes'

import { Reducer, fulfilled } from '../util/redux'

const initialState = {
  is_admin: false
}

let reducer = new Reducer(initialState)

reducer.handle(fulfilled(types.AUTH.VERIFY_TOKEN), (state, action) => {
  return R.merge(state, {
    is_admin: action.settings.is_admin
  })
})

reducer.handle(fulfilled(types.AUTH.CREATE_TOKEN), (state, action) => {
  return R.merge(state, {
    settings: action.settings
  })
})

export default reducer.getReducer()
