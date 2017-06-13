import { combineReducers } from 'redux'

import * as types from '../constants/ActionTypes'
import { fulfilled, Reducer } from '../util/redux'

import {
  buildManyResourceReducer,
  buildSingleResourceReducer
} from '../util/redux'

let pendingReducer = new Reducer(0)

pendingReducer.handle(fulfilled(types.EVENTS.COUNT_PENDING),
  (state, action) => action.payload)

export default combineReducers({
  list: buildManyResourceReducer(types.EVENTS).getReducer(),
  single: buildSingleResourceReducer(types.EVENTS).getReducer(),
  pending: pendingReducer.getReducer()
})
