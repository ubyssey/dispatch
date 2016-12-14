import * as types from '../constants/ActionTypes'
import { sectionSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

import { normalize, arrayOf } from 'normalizr'

export function fetchSections(token, query) {
  return {
    type: types.FETCH_SECTIONS,
    payload: DispatchAPI.sections.fetchSections(token, query)
      .then(function(json) {
        return {
          count: json.count,
          results: normalize(json.results, arrayOf(sectionSchema))
        }
      })
  }
}
