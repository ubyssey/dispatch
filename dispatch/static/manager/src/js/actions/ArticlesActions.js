import * as types from '../constants/ActionTypes'
import DispatchAPI from '../api/dispatch'

export function fetchArticles(params) {
  return {
    type: types.FETCH_ARTICLES,
    payload: DispatchAPI.articles.fetchArticles(params).then( json => json.results )
  }
}

export function fetchArticle(articleId) {
  return {
    type: types.FETCH_ARTICLE,
    payload: DispatchAPI.articles.fetchArticle(articleId)
  }
}
