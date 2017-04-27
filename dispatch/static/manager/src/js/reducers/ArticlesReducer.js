import { combineReducers } from 'redux'
import R from 'ramda'

import * as types from '../constants/ActionTypes'

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
  case types.FETCH_ARTICLES + '_PENDING':
    return R.merge(state, {
      isLoading: true
    })
  case types.FETCH_ARTICLES + '_FULFILLED':
    return R.merge(state, {
      isLoading: false,
      isLoaded: true,
      count: action.payload.count,
      ids: action.payload.results.result
    })
  case types.CLEAR_ARTICLES:
    return R.merge(state, {
      isLoaded: false,
      count: null,
      ids: []
    })
  case types.TOGGLE_ARTICLE:
    index = R.findIndex(R.equals(action.id), state.selected)
    return R.merge(state, {
      selected: index > -1 ? R.remove(index, 1, state.selected) : R.append(action.id, state.selected)
    })
  case types.TOGGLE_ALL_ARTICLES:
    return R.merge(state, {
      selected: state.isAllSelected ? [] : action.ids,
      isAllSelected: !state.isAllSelected
    })
  case types.CLEAR_SELECTED_ARTICLES:
    return R.merge(state, {
      selected: [],
      isAllSelected: false
    })
  case types.DELETE_ARTICLES + '_FULFILLED':
    return R.merge(state, {
      ids: R.without(action.payload, state.ids)
    })
  default:
    return state
  }
}

function articlesSingleReducer(state = initialState.single, action) {
  switch (action.type) {
  case types.FETCH_ARTICLE + '_PENDING':
    return R.merge(state, {
      isLoading: true
    })
  case `${types.PUBLISH_ARTICLE}_FULFILLED`:
  case `${types.UNPUBLISH_ARTICLE}_FULFILLED`:
  case `${types.FETCH_ARTICLE}_FULFILLED`:
  case `${types.SAVE_ARTICLE}_FULFILLED`:
    return R.merge(state, {
      isLoading: false,
      isLoaded: true,
      errors: {},
      id: action.payload.result
    })
  case types.SET_ARTICLE:
    return R.merge(state, {
      isLoading: false,
      isLoaded: true,
      id: action.payload.result
    })
  case `${types.SAVE_ARTICLE}_REJECTED`:
  case `${types.CREATE_ARTICLE}_REJECTED`:
  case `${types.PUBLISH_ARTICLE}_REJECTED`:
  case `${types.UNPUBLISH_ARTICLE}_REJECTED`:
    return R.merge(state, {
      errors: action.payload
    })
  default:
    return state
  }
}

export default combineReducers({
  list: articlesListReducer,
  single: articlesSingleReducer
})
