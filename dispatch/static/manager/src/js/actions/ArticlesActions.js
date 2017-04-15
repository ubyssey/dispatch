import R from 'ramda'
import { normalize, arrayOf } from 'normalizr'
import { push } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import { articleSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

import ContentStateHelper from '../components/ContentEditor/ContentStateHelper'

function preparePayload(data) {

  if (data._content) {
    // Convert article contentState to JSON array
    data.content = ContentStateHelper.toJSON(data._content)
    delete data._content
  }

  // Set section_id to section
  data.section_id = data.section

  // Set author_ids to authors
  data.author_ids = data.authors

  // Set tag_ids to tags
  data.tag_ids = data.tags

  // Set topic_id to topic
  data.topic_id = data.topic

  // Set template_id
  data.template_id = data.template
  delete data.template

  if (R.has('featured_image', data) && data.featured_image) {
    data.featured_image.image_id = data.featured_image.image
  }

  return data
}

export function fetchArticles(token, query) {
  return {
    type: types.FETCH_ARTICLES,
    payload: DispatchAPI.articles.fetchArticles(token, query)
      .then(function(json) {
        return {
          count: json.count,
          results: normalize(json.results, arrayOf(articleSchema))
        }
      })
  }
}

export function fetchArticle(token, articleId, params) {
  return {
    type: types.FETCH_ARTICLE,
    payload: DispatchAPI.articles.fetchArticle(token, articleId, params)
      .then( json => normalize(json, articleSchema) )
  }
}

export function setArticle(article) {
  return {
    type: types.SET_ARTICLE,
    payload: normalize(article, articleSchema)
  }
}

export function saveArticle(token, articleId, data) {

  data = preparePayload(data)

  return {
    type: types.SAVE_ARTICLE,
    payload: DispatchAPI.articles.saveArticle(token, articleId, data)
      .then( json => normalize(json, articleSchema) )
  }
}

export function createArticle(token, data) {

  data = preparePayload(data)

  return {
    type: types.CREATE_ARTICLE,
    payload: DispatchAPI.articles.createArticle(token, data)
  }
}

export function publishArticle(token, articleId, data) {

  data = preparePayload(data)

  return function(dispatch) {

    dispatch(() => ({ type: `${types.PUBLISH_ARTICLE}_PENDING` }))

    DispatchAPI.articles.saveArticle(token, articleId, data)
      .then( () => DispatchAPI.articles.publishArticle(token, articleId))
      .then( json => normalize(json, articleSchema) )
      .then( payload => {
        dispatch({
          type: `${types.PUBLISH_ARTICLE}_FULFILLED`,
          payload: payload
        })
      })
      .catch( error => {
        dispatch(() => ({
          type: `${types.PUBLISH_ARTICLE}_REJECTED`,
          payload: error
        }))
      })
  }
}

export function unpublishArticle(token, articleId) {
  return {
    type: types.UNPUBLISH_ARTICLE,
    payload: DispatchAPI.articles.unpublishArticle(token, articleId)
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

export function searchArticles(section, query) {

  var queryObj = {}

  if (query) {
    queryObj.q = query
  }

  if (section) {
    queryObj.section = section
  }

  return function(dispatch) {
    dispatch(push({ pathname: '/articles/', query: queryObj }))
  }
}
