import { combineReducers } from 'redux'

import * as types from '../constants/ActionTypes'

import {
  buildManyResourceReducer,
  buildSingleResourceReducer
} from '../util/redux'


export default combineReducers({
  list: buildManyResourceReducer(types.USERS).getReducer(),
  single: buildSingleResourceReducer(types.USERS).getReducer(),
})
