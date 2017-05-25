import { combineReducers } from 'redux'

import * as types from '../constants/ActionTypes'

import { buildManyResourceReducer, buildSingleResourceReducer } from '../util/redux'

export default combineReducers({
  list: buildManyResourceReducer(types.ZONES).getReducer(),
  single: buildSingleResourceReducer(types.ZONES).getReducer()
})
