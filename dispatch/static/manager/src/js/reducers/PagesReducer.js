import { combineReducers } from 'redux'
import R from 'ramda'

import * as types from '../constants/ActionTypes'

const initialState = {
  pages: {
    isLoading: false,
    isLoaded: false,
    selected: [],
    isAllSelected: false,
    count: null,
    data: []
  },
  page: {
    isLoading: false,
    isLoaded: false,
    errors: {},
    data: null
  }
}

function pagesReducer(state = initialState.pages, action) {
  let index
  switch (action.type) {
  case types.FETCH_PAGES + '_PENDING':
    return R.merge(state, {
      isLoading: true
    })
  case types.FETCH_PAGES + '_FULFILLED':
    return R.merge(state, {
      isLoading: false,
      isLoaded: true,
      count: action.payload.count,
      data: action.payload.results.result
    })
  case types.CLEAR_PAGES:
    return R.merge(state, {
      isLoaded: false,
      count: null,
      data: []
    })
  case types.TOGGLE_PAGE:
    index = R.findIndex(R.equals(action.id), state.selected)
    return R.merge(state, {
      selected: index > -1 ? R.remove(index, 1, state.selected) : R.append(action.id, state.selected)
    })
  case types.TOGGLE_ALL_PAGES:
    return R.merge(state, {
      selected: state.isAllSelected ? [] : action.ids,
      isAllSelected: !state.isAllSelected
    })
  case types.CLEAR_SELECTED_PAGES:
    return R.merge(state, {
      selected: [],
      isAllSelected: false
    })
  case types.DELETE_PAGES + '_FULFILLED':
    return R.merge(state, {
      data: R.without(action.payload, state.data)
    })
  default:
    return state
  }
}

function pageReducer(state = initialState.page, action) {
  switch (action.type) {
  case types.FETCH_PAGE + '_PENDING':
    return R.merge(state, {
      isLoading: true
    })
  case `${types.PUBLISH_PAGE}_FULFILLED`:
  case `${types.UNPUBLISH_PAGE}_FULFILLED`:
  case `${types.FETCH_PAGE}_FULFILLED`:
  case `${types.SAVE_PAGE}_FULFILLED`:
    return R.merge(state, {
      isLoading: false,
      isLoaded: true,
      errors: {},
      data: action.payload.result
    })
  case types.SET_PAGE:
    return R.merge(state, {
      isLoading: false,
      isLoaded: true,
      data: action.payload.result
    })
  case `${types.SAVE_PAGE}_REJECTED`:
  case `${types.CREATE_PAGE}_REJECTED`:
  case `${types.PUBLISH_PAGE}_REJECTED`:
  case `${types.UNPUBLISH_PAGE}_REJECTED`:
    return R.merge(state, {
      errors: action.payload
    })
  default:
    return state
  }
}

export default combineReducers({
  pages: pagesReducer,
  page: pageReducer
})
