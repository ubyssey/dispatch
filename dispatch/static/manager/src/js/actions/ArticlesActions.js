import * as types from '../constants/ActionTypes'
import DispatchAPI from '../api/dispatch'

function requestArticles() {
  return {
    type: types.ARTICLES_REQUEST
  }
}

function receiveArticles(articles) {
  return {
    type: types.ARTICLES_RECEIVE,
    articles: articles
  }
}

function requestArticle() {
  return {
    type: types.ARTICLE_REQUEST
  }
}

function receiveArticle(article) {
  return {
    type: types.ARTICLE_RECEIVE,
    article: article
  }
}

export function fetchArticles(params) {
  return function (dispatch) {
    dispatch(requestArticles())

    return DispatchAPI.articles.fetchArticles(params)
      .then( json => dispatch(receiveArticles(json.results)) )
  }
}

export function fetchArticle(articleId) {
  return function (dispatch) {
    dispatch(requestArticle())

    return DispatchAPI.articles.fetchArticle(articleId)
      .then( json => dispatch(receiveArticle(json)) )
  }
}
