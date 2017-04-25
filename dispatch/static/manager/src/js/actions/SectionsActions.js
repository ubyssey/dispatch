import { push } from 'react-router-redux'
import { normalize, arrayOf } from 'normalizr'

import * as types from '../constants/ActionTypes'
import { sectionSchema } from '../constants/Schemas'

import DispatchAPI from '../api/dispatch'

export function fetchSections(token, query) {
  return {
    type: types.FETCH_SECTIONS,
    payload: DispatchAPI.sections.fetchSections(token, query)
      .then(json => ({
        count: json.count,
        results: normalize(json.results, arrayOf(sectionSchema))
      }))
  }
}

export function fetchSectionsNav(token) {
  return {
    type: types.FETCH_SECTIONS_NAV,
    payload: DispatchAPI.sections.fetchSections(token)
      .then(json => ({
        results: normalize(json.results, arrayOf(sectionSchema))
      }))
  }
}

export function fetchSection(token, sectionId) {
  return {
    type: types.FETCH_SECTION,
    payload: DispatchAPI.sections.fetchSection(token, sectionId)
      .then(json => normalize(json, sectionSchema))
  }
}

export function setSection(section) {
  return {
    type: types.SET_SECTION,
    payload: normalize(section, sectionSchema)
  }
}

export function saveSection(token, sectionId, data) {
  return {
    type: types.SAVE_SECTION,
    payload: DispatchAPI.sections.saveSection(token, sectionId, data)
      .then(json => normalize(json, sectionSchema))
  }
}

export function createSection(token, data) {
  return {
    type: types.CREATE_SECTION,
    payload: DispatchAPI.sections.createSection(token, data)
  }
}

export function toggleSection(sectionId) {
  return {
    type: types.TOGGLE_SECTION,
    id: sectionId
  }
}

export function toggleAllSections(sectionIds) {
  return {
    type: types.TOGGLE_ALL_SECTIONS,
    ids: sectionIds
  }
}

export function clearSelectedSections() {
  return {
    type: types.CLEAR_SELECTED_SECTIONS
  }
}

export function deleteSections(token, sectionIds) {
  return function(dispatch) {
    dispatch({ type: `${types.DELETE_SECTIONS}_PENDING` })

    Promise.all(
      sectionIds.map(sectionId => DispatchAPI.sections.deleteSection(token, sectionId))
    )
    .then(() => {
      dispatch({
        type: `${types.DELETE_SECTIONS}_FULFILLED`,
        payload: sectionIds
      })
    })
    .catch(error => {
      dispatch({
        type: `${types.DELETE_SECTIONS}_REJECTED`,
        payload: error
      })
    })

  }
}

export function clearSections() {
  return {
    type: types.CLEAR_SECTIONS
  }
}

export function searchSections(query) {

  var queryObj = {}

  if (query) {
    queryObj.q = query
  }

  return function(dispatch) {
    dispatch(push({ pathname: '/sections/', query: queryObj }))
  }
}
