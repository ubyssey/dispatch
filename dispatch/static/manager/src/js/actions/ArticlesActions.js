import { normalize, arrayOf } from 'normalizr'
import { push } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import { articleSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

import ContentStateHelper from '../components/ContentEditor/ContentStateHelper'

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

  if (data._content) {
    // Convert article contentState to JSON array
    data.content_json = JSON.stringify(ContentStateHelper.toJSON(data._content))
  }

  // Delete old content state
  delete data._content

  // Set section_id to section
  data.section_id = data.section
  
  // Set author_ids to authors
  data.author_ids = data.authors

  // Set tag_ids to tags
  data.tag_ids = data.tags

  // Set topic_id to topic
  data.topic_id = data.topic

  // Set featured_image_json and delete featured_image
  data.featured_image_json = data.featured_image
  delete data.featured_image

  // Set template_id
  data.template_id = data.template
  delete data.template

  return {
    type: types.SAVE_ARTICLE,
    payload: DispatchAPI.articles.saveArticle(token, articleId, data)
      .then( json => normalize(json, articleSchema) )
  }
}

export function createArticle(token, data) {

  if (data._content) {
    // Convert article contentState to JSON array
    data.content_json = JSON.stringify(ContentStateHelper.toJSON(data._content))
  }

  // Delete old content state
  delete data._content

  // Set section_id to section
  data.section_id = data.section

  // Set author_ids to authors
  data.author_ids = data.authors

  // Set tag_ids to tags
  data.tag_ids = data.tags

  // Set topic_id to topic
  data.topic_id = data.topic

  // Set featured_image_json and delete featured_image
  data.featured_image_json = data.featured_image
  delete data.featured_image

  // Set template_id
  data.template_id = data.template
  delete data.template

  return {
    type: types.CREATE_ARTICLE,
    payload: DispatchAPI.articles.createArticle(token, data)
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
