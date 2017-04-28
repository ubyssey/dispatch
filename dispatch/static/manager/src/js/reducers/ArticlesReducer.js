import { combineReducers } from 'redux'
import R from 'ramda'

import * as types from '../constants/ActionTypes'

import { pending, fulfilled, rejected } from './ReducerHelpers'

const initialState = {
  list: {
    isLoading: false,
    isLoaded: false,
    selected: [],
    isAllSelected: false,
    count: null,
    ids: []
  },
  single: {
    isLoading: false,
    isLoaded: false,
    errors: {},
    id: null
  }
}

function articlesListReducer(state = initialState.list, action) {
  let index
  switch (action.type) {
  case pending(types.ARTICLES.LIST):
    return R.merge(state, {
      isLoading: true
    })
  case fulfilled(types.ARTICLES.LIST):
    return R.merge(state, {
      isLoading: false,
      isLoaded: true,
      count: action.payload.count,
      ids: action.payload.results.result
    })
  case types.ARTICLES.CLEAR_ALL:
    return R.merge(state, {
      isLoaded: false,
      count: null,
      ids: []
    })
  case types.ARTICLES.TOGGLE:
    index = R.findIndex(R.equals(action.id), state.selected)
    return R.merge(state, {
      selected: index > -1 ? R.remove(index, 1, state.selected) : R.append(action.id, state.selected)
    })
  case types.ARTICLES.TOGGLE_ALL:
    return R.merge(state, {
      selected: state.isAllSelected ? [] : action.ids,
      isAllSelected: !state.isAllSelected
    })
  case types.ARTICLES.CLEAR_SELECTED:
    return R.merge(state, {
      selected: [],
      isAllSelected: false
    })
  case fulfilled(types.ARTICLES.DELETE_MANY):
    return R.merge(state, {
      ids: R.without(action.payload, state.ids)
    })
  default:
    return state
  }
}

function articlesSingleReducer(state = initialState.single, action) {
  switch (action.type) {
  case pending(types.ARTICLES.GET):
    return R.merge(state, {
      isLoading: true
    })
  case fulfilled(types.ARTICLES.GET):
  case fulfilled(types.ARTICLES.SAVE):
  case fulfilled(types.ARTICLES.PUBLISH):
  case fulfilled(types.ARTICLES.UNPUBLISH):
    return R.merge(state, {
      isLoading: false,
      isLoaded: true,
      errors: {},
      id: action.payload.result
    })
  case rejected(types.ARTICLES.SAVE):
  case rejected(types.ARTICLES.CREATE):
  case rejected(types.ARTICLES.PUBLISH):
  case rejected(types.ARTICLES.UNPUBLISH):
    return R.merge(state, {
      errors: action.payload
    })
  case types.ARTICLES.SET:
    return R.merge(state, {
      isLoading: false,
      isLoaded: true,
      id: action.payload.result
    })
  default:
    return state
  }
}

export default combineReducers({
  list: articlesListReducer,
  single: articlesSingleReducer
})
