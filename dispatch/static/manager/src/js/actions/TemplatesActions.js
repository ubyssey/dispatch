import * as types from '../constants/ActionTypes'
import { templateSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

import { normalize, arrayOf } from 'normalizr'

export function list(token, query) {
  return {
    type: types.FETCH_TEMPLATES,
    payload: DispatchAPI.templates.fetchTemplates(token, query)
      .then(function(json) {
        return {
          count: json.count,
          results: normalize(json.results, arrayOf(templateSchema))
        }
      })
  }
}

export function get(token, templateId) {
  return {
    type: types.FETCH_TEMPLATE,
    payload: DispatchAPI.templates.fetchTemplate(token, templateId)
      .then( json => {
        return normalize(json, templateSchema)
      })
  }
}
