import { combineReducers } from 'redux'

import * as types from '../constants/ActionTypes'

import {
  Reducer,
  fulfilled,
  buildManyResourceReducer,
  buildSingleResourceReducer
} from '../util/redux'


const newIdReducer = new Reducer(0)
newIdReducer.handle(fulfilled(types.TAGS.CREATE), (state, action) => {
  return action.payload.data.result
})

export default combineReducers({
  list: buildManyResourceReducer(types.TAGS).getReducer(),
  single: buildSingleResourceReducer(types.TAGS).getReducer(),
  newId: newIdReducer.getReducer()
})
