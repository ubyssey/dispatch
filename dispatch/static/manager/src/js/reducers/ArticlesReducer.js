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
    case types.ARTICLES_REQUEST:
      return Object.assign({}, state, {
        isLoading: true
      })
    case types.ARTICLES_RECEIVE:
      return Object.assign({}, state, {
        isLoading: false,
        isLoaded: true,
        data: action.articles
      })
    default:
      return state
  }
}

function articleReducer(state = initialState.article, action) {
  switch (action.type) {
    case types.ARTICLE_REQUEST:
      return Object.assign({}, state, {
        isLoading: true
      })
    case types.ARTICLE_RECEIVE:
      return Object.assign({}, state, {
        isLoading: false,
        isLoaded: true,
        data: action.article
      })
    default:
      return state
  }
}

export default combineReducers({
  articles: articlesReducer,
  article: articleReducer
})
