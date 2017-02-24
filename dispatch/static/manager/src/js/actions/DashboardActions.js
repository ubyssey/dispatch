import * as types from '../constants/ActionTypes'
import { normalize, arrayOf } from 'normalizr'
import { articleSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

export function getUserActions(token) {
  return {
    type: types.FETCH_ACTIONS,
    payload: DispatchAPI.dashboard.actions(token)
      .then(json => {
        return json
      })
  }
}

export function getRecentArticles(token) {
  return {
    type: types.FETCH_RECENT_ARTICLES,
    payload: DispatchAPI.dashboard.recent(token)
      .then(json => {
        return normalize(json.results, arrayOf(articleSchema))
      })
  }
}
