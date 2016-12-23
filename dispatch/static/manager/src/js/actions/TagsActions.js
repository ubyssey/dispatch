import * as types from '../constants/ActionTypes'
import { tagSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

import { normalize, arrayOf } from 'normalizr'

export function fetchTags(token, query) {
  return {
    type: types.FETCH_TAGS,
    payload: DispatchAPI.tags.fetchTags(token, query)
      .then(function(json) {
        return {
          count: json.count,
          results: normalize(json.results, arrayOf(tagSchema))
        }
      })
  }
}

export function createTag(token, name) {
  return {
    type: types.CREATE_TAG,
    payload: DispatchAPI.tags.createTag(token, name)
      .then( json => {
        normalize(json, topicSchema)
      })
  }
}
