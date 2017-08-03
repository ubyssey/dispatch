import R from 'ramda'

import { combineReducers } from 'redux'

import * as types from '../constants/ActionTypes'

import {
  Reducer,
  pending,
  fulfilled
} from '../util/redux'

const initialState = {
  isLoading: false,
  isLoaded: false,
  selected: [],
  count: null,
  ids: [],
  zones: {}
}

let reducer = new Reducer(initialState)

reducer.handle(pending(types.ZONES.LIST_WIDGETS), (state) => {
  return R.merge(state,
    {
      isLoading: true,
      selected: [],
      count: null,
      ids: []
    }
  )
})

reducer.handle(fulfilled(types.ZONES.LIST_WIDGETS), (state, action) => {
  return R.merge(state,
    {
      isLoading: false,
      selected: [],
      count: action.payload.data.count,
      ids: action.payload.data.result,
      zones: R.merge(state.zones, R.objOf(
          action.payload.zoneId, action.payload.data.result
      ))
    }
  )
})

export default combineReducers({
  list: reducer.getReducer()
})
