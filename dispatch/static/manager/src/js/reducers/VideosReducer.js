import R from 'ramda'
import { combineReducers } from 'redux'

import * as types from '../constants/ActionTypes'

import {
  fulfilled,
  buildManyResourceReducer,
  buildSingleResourceReducer
} from '../util/redux'

let manyReducer = buildManyResourceReducer(types.VIDEOS)

manyReducer.handle(fulfilled(types.VIDEOS.CREATE), (state, action) => {
  return R.merge(state, {
    ids: R.prepend(action.payload.data.result, state.ids)
  })
})

export default combineReducers({
  list: manyReducer.getReducer(),
  single: buildSingleResourceReducer(types.VIDEOS).getReducer(),
})