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

let manyReducer = buildManyResourceReducer(types.ARTICLES)
let singleReducer = buildSingleResourceReducer(types.ARTICLES)

singleReducer.handle(fulfilled(types.ARTICLES.PUBLISHED), handleSuccess)
singleReducer.handle(fulfilled(types.ARTICLES.UNPUBLISHED), handleSuccess)

singleReducer.handle(rejected(types.ARTICLES.PUBLISHED), handleError)
singleReducer.handle(rejected(types.ARTICLES.UNPUBLISHED), handleError)

export default combineReducers({
  list: manyReducer.reduce,
  single: singleReducer.reduce
})
