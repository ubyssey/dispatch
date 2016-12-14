import * as types from '../constants/ActionTypes'
import { topicSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

import { normalize, arrayOf } from 'normalizr'

export function fetchTopics(token, query) {
  return {
    type: types.FETCH_TOPICS,
    payload: DispatchAPI.topics.fetchTopics(token, query)
      .then(function(json) {
        return {
          count: json.count,
          results: normalize(json.results, arrayOf(topicSchema))
        }
      })
  }
}

export function createTopic(token, name) {
  return {
    type: types.CREATE_TOPIC,
    payload: DispatchAPI.topics.createTopic(token, name)
      .then( json => {
        normalize(json, topicSchema)
      })
  }
}
