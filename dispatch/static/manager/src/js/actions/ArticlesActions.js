import { normalize, arrayOf } from 'normalizr'

import * as types from '../constants/ActionTypes'
import { articleSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

export function fetchArticles(params) {
  return {
    type: types.FETCH_ARTICLES,
    payload: DispatchAPI.articles.fetchArticles(params)
      .then( json => normalize(json.results, arrayOf(articleSchema)) )
  }
}

export function setArticle(articleId) {
  return {
    type: types.SET_ARTICLE,
    id: articleId
  }
}

export function fetchArticle(articleId) {
  return {
    type: types.FETCH_ARTICLE,
    payload: DispatchAPI.articles.fetchArticle(articleId)
      .then( json => normalize(json, articleSchema) )
  }
}
