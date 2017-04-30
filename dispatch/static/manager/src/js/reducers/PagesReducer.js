import { combineReducers } from 'redux'

import * as types from '../constants/ActionTypes'

import {
  fulfilled,
  rejected,
  buildSingleResourceReducer,
  buildManyResourceReducer,
  handleSuccess,
  handleError
} from '../util/redux'

let manyReducer = buildManyResourceReducer(types.PAGES)
let singleReducer = buildSingleResourceReducer(types.PAGES)

singleReducer.handle(fulfilled(types.PAGES.PUBLISHED), handleSuccess)
singleReducer.handle(fulfilled(types.PAGES.UNPUBLISHED), handleSuccess)

singleReducer.handle(rejected(types.PAGES.PUBLISHED), handleError)
singleReducer.handle(rejected(types.PAGES.UNPUBLISHED), handleError)

export default combineReducers({
  list: manyReducer.reduce,
  single: singleReducer.reduce
})
