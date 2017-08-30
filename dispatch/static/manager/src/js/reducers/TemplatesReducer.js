import { combineReducers } from 'redux'

import * as types from '../constants/ActionTypes'
import { buildManyResourceReducer } from '../util/redux'

export default combineReducers({
  list: buildManyResourceReducer(types.TEMPLATES).getReducer(),
})
