import R from 'ramda'
import { combineReducers } from 'redux'

import * as types from '../constants/ActionTypes'

const initialState = {
  navigation: {
    isLoading: false,
    isLoaded: false,
    ids: []
  },
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

function sectionsNavigationReducer(state = initialState.navigation, action) {
  switch (action.type) {
  case types.FETCH_SECTIONS_NAV + '_PENDING':
    return R.merge(state, {
      isLoading: true
    })
  case types.FETCH_SECTIONS_NAV + '_FULFILLED':
    return R.merge(state, {
      isLoading: false,
      isLoaded: true,
      ids: action.payload.results.result
    })
  default:
    return state
  }
}

function sectionsListReducer(state = initialState.list, action) {
  let index
  switch (action.type) {
  case types.FETCH_SECTIONS + '_PENDING':
    return R.merge(state, {
      isLoading: true
    })
  case types.FETCH_SECTIONS + '_FULFILLED':
    return R.merge(state, {
      isLoading: false,
      isLoaded: true,
      count: action.payload.count,
      ids: action.payload.results.result
    })
  case types.CLEAR_SECTIONS:
    return R.merge(state, {
      isLoaded: false,
      count: null,
      ids: []
    })
  case types.TOGGLE_SECTION:
    index = R.findIndex(R.equals(action.id), state.selected)
    return R.merge(state, {
      selected: index > -1 ? R.remove(index, 1, state.selected) : R.append(action.id, state.selected)
    })
  case types.TOGGLE_ALL_SECTIONS:
    return R.merge(state, {
      selected: state.isAllSelected ? [] : action.ids,
      isAllSelected: !state.isAllSelected
    })
  case types.CLEAR_SELECTED_SECTIONS:
    return R.merge(state, {
      selected: [],
      isAllSelected: false
    })
  case types.DELETE_SECTIONS + '_FULFILLED':
    return R.merge(state, {
      ids: R.without(action.payload, state.data)
    })
  default:
    return state
  }
}

function sectionsSingleReducer(state = initialState.single, action) {
  switch (action.type) {
  case types.FETCH_SECTION + '_PENDING':
    return R.merge(state, {
      isLoading: true
    })
  case `${types.FETCH_SECTION}_FULFILLED`:
  case `${types.SAVE_SECTION}_FULFILLED`:
    return R.merge(state, {
      isLoading: false,
      isLoaded: true,
      errors: {},
      id: action.payload.result
    })
  case types.SET_SECTION:
    return R.merge(state, {
      isLoading: false,
      isLoaded: true,
      id: action.payload.result
    })
  case `${types.SAVE_SECTION}_REJECTED`:
  case `${types.CREATE_SECTION}_REJECTED`:
  case `${types.PUBLISH_SECTION}_REJECTED`:
  case `${types.UNPUBLISH_SECTION}_REJECTED`:
    return R.merge(state, {
      errors: action.payload
    })
  default:
    return state
  }
}

export default combineReducers({
  navigation: sectionsNavigationReducer,
  list: sectionsListReducer,
  single: sectionsSingleReducer
})
