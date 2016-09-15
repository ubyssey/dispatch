import * as types from '../constants/ActionTypes'
import { sectionSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

import { normalize, arrayOf } from 'normalizr'

export function fetchSections(params) {
  return {
    type: types.FETCH_SECTIONS,
    payload: DispatchAPI.sections.fetchSections()
      .then( json => normalize(json.results, arrayOf(sectionSchema)) )
  }
}
