import { combineReducers } from 'redux'
import R from 'ramda';

import * as types from '../constants/ActionTypes'

const initialState = {
  articles: {
    isLoading: false,
    isLoaded: false,
    selected: [],
    isAllSelected: false,
    count: null,
    data: []
  },
  article: {
    isLoading: false,
    isLoaded: false,
    data: null
  }
}

function articlesReducer(state = initialState.articles, action) {
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
        data: action.payload.results.result
      })
    case types.CLEAR_ARTICLES:
      return R.merge(state, {
        isLoaded: false,
        count: null,
        data: []
      })
    case types.TOGGLE_ARTICLE:
      let index = R.findIndex(R.equals(action.id), state.selected);
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
        data: R.without(action.payload, state.data)
      })
    default:
      return state
  }
}

function articleReducer(state = initialState.article, action) {
  switch (action.type) {
    case types.FETCH_ARTICLE + '_PENDING':
      return R.merge(state, {
        isLoading: true
      })
    case types.FETCH_ARTICLE + '_FULFILLED':
    case types.SAVE_ARTICLE + '_FULFILLED':
    case types.SET_ARTICLE:
      return R.merge(state, {
        isLoading: false,
        isLoaded: true,
        data: action.payload.result
      })
    default:
      return state
  }
}

export default combineReducers({
  articles: articlesReducer,
  article: articleReducer
})
