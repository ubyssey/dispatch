import { normalize, arrayOf } from 'normalizr'

import * as types from '../constants/ActionTypes'
import { articleSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

export function fetchArticles(params) {
  return {
    type: types.FETCH_ARTICLES,
    payload: DispatchAPI.articles.fetchArticles(params)
      .then( function(json) {
        return {
          count: json.count,
          results: normalize(json.results, arrayOf(articleSchema))
        }
      } )
  }
}

export function fetchArticle(articleId) {
  return {
    type: types.FETCH_ARTICLE,
    payload: DispatchAPI.articles.fetchArticle(articleId)
      .then( json => normalize(json, articleSchema) )
  }
}

export function toggleArticle(articleId) {
  return {
    type: types.TOGGLE_ARTICLE,
    id: articleId
  }
}

export function toggleAllArticles(articleIds) {
  return {
    type: types.TOGGLE_ALL_ARTICLES,
    ids: articleIds
  }
}

export function clearSelectedArticles() {
  return {
    type: types.CLEAR_SELECTED_ARTICLES
  }
}

export function deleteArticles(token, articleIds) {
  return {
    type: types.DELETE_ARTICLES,
    payload: DispatchAPI.articles.deleteArticles(token, articleIds)
      .then( json => json.deleted )
  }
}

export function clearArticles() {
  return {
    type: types.CLEAR_ARTICLES
  }
}
