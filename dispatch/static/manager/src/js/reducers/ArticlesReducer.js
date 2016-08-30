import { combineReducers } from 'redux'

import * as types from '../constants/ActionTypes'

const initialState = {
  articles: {
    isLoading: false,
    isLoaded: false,
    data: []
  },
  article: {
    isLoading: false,
    isLoaded: false,
    data: {}
  }
}

function articlesReducer(state = initialState.articles, action) {
  switch (action.type) {
    case types.FETCH_ARTICLES + '_PENDING':
      return Object.assign({}, state, {
        isLoading: true
      })
      case types.FETCH_ARTICLES + '_FULFILLED':
      return Object.assign({}, state, {
        isLoading: false,
        isLoaded: true,
        data: action.payload
      })
    default:
      return state
  }
}

function articleReducer(state = initialState.article, action) {
  switch (action.type) {
    case types.FETCH_ARTICLE + '_PENDING':
      return Object.assign({}, state, {
        isLoading: true
      })
    case types.FETCH_ARTICLE + '_FULFILLED':
      return Object.assign({}, state, {
        isLoading: false,
        isLoaded: true,
        data: action.payload
      })
    default:
      return state
  }
}

export default combineReducers({
  articles: articlesReducer,
  article: articleReducer
})
