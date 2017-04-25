import { normalize, arrayOf } from 'normalizr'
import { push } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import { pageSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

import ContentStateHelper from '../components/ContentEditor/ContentStateHelper'

function preparePayload(data) {

  if (data._content) {
    // Convert page contentState to JSON array
    data.content = ContentStateHelper.toJSON(data._content)
    delete data._content
  }

  // Set template_id
  data.template_id = data.template
  delete data.template

  if (data.featured_image) {
    data.featured_image.image_id = data.featured_image.image
  }

  return data
}

export function fetchPages(token, query) {
  return {
    type: types.FETCH_PAGES,
    payload: DispatchAPI.pages.fetchPages(token, query)
      .then(function(json) {
        return {
          count: json.count,
          results: normalize(json.results, arrayOf(pageSchema))
        }
      })
  }
}

export function fetchPage(token, pageId, params) {
  return {
    type: types.FETCH_PAGE,
    payload: DispatchAPI.pages.fetchPage(token, pageId, params)
      .then( json => normalize(json, pageSchema) )
  }
}

export function setPage(page) {
  return {
    type: types.SET_PAGE,
    payload: normalize(page, pageSchema)
  }
}

export function savePage(token, pageId, data) {

  data = preparePayload(data)

  return {
    type: types.SAVE_PAGE,
    payload: DispatchAPI.pages.savePage(token, pageId, data)
      .then( json => normalize(json, pageSchema) )
  }
}

export function createPage(token, data) {

  data = preparePayload(data)

  return {
    type: types.CREATE_PAGE,
    payload: DispatchAPI.pages.createPage(token, data)
  }
}

export function publishPage(token, pageId, data) {

  data = preparePayload(data)

  return function(dispatch) {

    dispatch({ type: `${types.PUBLISH_PAGE}_PENDING` })

    DispatchAPI.pages.savePage(token, pageId, data)
      .then(() => DispatchAPI.pages.publishPage(token, pageId))
      .then(json => normalize(json, pageSchema))
      .then(payload => {
        dispatch({
          type: `${types.PUBLISH_PAGE}_FULFILLED`,
          payload: payload
        })
      })
      .catch( error => {
        dispatch({
          type: `${types.PUBLISH_PAGE}_REJECTED`,
          payload: error
        })
      })
  }
}

export function unpublishPage(token, pageId) {
  return {
    type: types.UNPUBLISH_PAGE,
    payload: DispatchAPI.pages.unpublishPage(token, pageId)
      .then( json => normalize(json, pageSchema) )
  }
}

export function togglePage(pageId) {
  return {
    type: types.TOGGLE_PAGE,
    id: pageId
  }
}

export function toggleAllPages(pageIds) {
  return {
    type: types.TOGGLE_ALL_PAGES,
    ids: pageIds
  }
}

export function clearSelectedPages() {
  return {
    type: types.CLEAR_SELECTED_PAGES
  }
}

export function deletePages(token, pageIds) {
  return function(dispatch) {
    dispatch({ type: `${types.DELETE_PAGES}_PENDING` })

    Promise.all(
      pageIds.map(pageId => DispatchAPI.pages.deletePage(token, pageId))
    )
    .then(() => {
      dispatch({
        type: `${types.DELETE_PAGES}_FULFILLED`,
        payload: pageIds
      })
    })
    .catch(error => {
      dispatch({
        type: `${types.DELETE_PAGES}_REJECTED`,
        payload: error
      })
    })

  }
}

export function clearPages() {
  return {
    type: types.CLEAR_PAGES
  }
}

export function searchPages(section, query) {

  var queryObj = {}

  if (query) {
    queryObj.q = query
  }

  if (section) {
    queryObj.section = section
  }

  return function(dispatch) {
    dispatch(push({ pathname: '/pages/', query: queryObj }))
  }
}
