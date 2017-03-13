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
        console.log("Actions: "+JSON.stringify(json.results))
        console.log("Actions: "+JSON.stringify(normalize(json.results, arrayOf(fileSchema))))
        return {
          results: normalize(json.results, arrayOf(fileSchema))
        }
      })
  }
}
