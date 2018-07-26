import { combineReducers } from 'redux'

import * as types from '../constants/ActionTypes'

import {
  buildManyResourceReducer,
  buildSingleResourceReducer
} from '../util/redux'

export default combineReducers({
  list: buildManyResourceReducer(types.INVITES).getReducer(),
  single: buildSingleResourceReducer(types.INVITES).getReducer()
})
