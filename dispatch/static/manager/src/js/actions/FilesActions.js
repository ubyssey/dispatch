import { normalize, arrayOf } from 'normalizr'
import { push } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import { fileSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'


export function fetchFiles(token, query) {
  return {
    type: types.FETCH_FILES,
    payload: DispatchAPI.files.fetchFiles(token, query)
      .then(function(json) {
        return {
          results: normalize(json.results, arrayOf(fileSchema))
        }
      })
  }
}

export function createFile(token, file) {
  return {
    type: types.CREATE_FILE,
    payload: DispatchAPI.files.createFile(token, file)
  }
}

export function deleteFiles(token, fileIds) {
  return {
    type: types.DELETE_FILES,
    payload: DispatchAPI.files.deleteFiles(token, fileIds)
      .then( json => json.deleted )
  }
}

export function toggleFile(fileId) {
  return {
    type: types.TOGGLE_FILE,
    id: fileId
  }
}


export function toggleAllFiles(fileIds) {
  return {
    type: types.TOGGLE_ALL_FILES,
    ids: fileIds
  }
}

export function clearSelectedFiles() {
  return {
    type: types.CLEAR_SELECTED_FILES
  }
}

export function clearFiles() {
  return {
    type: types.CLEAR_FILES
  }
}

export function searchFiles(query) {
  var queryObj = {}
  if(query) {
    queryObj.q = query
  }

  return function(dispatch) {
    dispatch(push({ pathname: '/files/', query: queryObj }))
  }
}
