import R from 'ramda'
import { combineReducers } from 'redux'

import * as types from '../constants/ActionTypes'

import {
  pending,
  fulfilled,
  Reducer,
  buildManyResourceReducer,
  buildSingleResourceReducer
} from '../util/redux'

const initialState = {
  navigation: {
    isLoading: false,
    isLoaded: false,
    ids: []
  }
}

let navigationReducer = new Reducer(initialState.navigation)

navigationReducer.handle(pending(types.TAGS.LIST_NAV), (state) => R.merge(state, { isLoading: true }))
navigationReducer.handle(fulfilled(types.TAGS.LIST_NAV), (state, action) => {
  return R.merge(state, {
    isLoading: false,
    isLoaded: true,
    ids: action.payload.data.result
  })
})

export default combineReducers({
  navigation: navigationReducer.getReducer(),
  list: buildManyResourceReducer(types.TAGS).getReducer(),
  single: buildSingleResourceReducer(types.TAGS).getReducer(),
})
