import { combineReducers } from 'redux'

import * as types from '../constants/ActionTypes'

import {
  buildManyResourceReducer,
  buildSingleResourceReducer
} from '../util/redux'


export default combineReducers({
  list: buildManyResourceReducer(types.PODCAST_EPISODES).getReducer(),
  single: buildSingleResourceReducer(types.PODCAST_EPISODES).getReducer(),
})
