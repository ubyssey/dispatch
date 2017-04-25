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
