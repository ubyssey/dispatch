import * as types from '../constants/ActionTypes'
import { normalize, arrayOf } from 'normalizr'
import { articleSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

export function getUserActions(token) {
  return {
    type: types.DASHBOARD.LIST_ACTIONS,
    payload: DispatchAPI.dashboard.actions(token)
  }
}

export function getRecentArticles(token) {
  return {
    type: types.DASHBOARD.LIST_RECENT_ARTICLES,
    payload: DispatchAPI.dashboard.recent(token)
      .then(json => ({
        data: normalize(json.results, arrayOf(articleSchema))
      }))
  }
}
