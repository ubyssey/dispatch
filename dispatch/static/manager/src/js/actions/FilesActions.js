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
