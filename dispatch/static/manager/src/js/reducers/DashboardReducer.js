import R from 'ramda'
import { combineReducers } from 'redux'

import * as types from '../constants/ActionTypes'

import { pending, fulfilled, Reducer } from '../util/redux'

const initialState = {
  actions: {
    isLoading: false,
    isLoaded: false,
    data: []
  },
  recent: {
    isLoading: false,
    isLoaded: false,
    ids: []
  }
}

let actionsReducer = new Reducer(initialState.actions)

actionsReducer.handle(pending(types.DASHBOARD.LIST_ACTIONS), (state) => R.merge(state, { isLoading: true }))
actionsReducer.handle(fulfilled(types.DASHBOARD.LIST_ACTIONS), (state, action) => {
  return R.merge(state,{
    isLoading: false,
    isLoaded: true,
    data: action.payload.results
  })
})

let recentReducer = new Reducer(initialState.recent)

recentReducer.handle(pending(types.DASHBOARD.LIST_RECENT_ARTICLES), (state) => R.merge(state, { isLoading: true }))
recentReducer.handle(fulfilled(types.DASHBOARD.LIST_RECENT_ARTICLES), (state, action) => {
  return R.merge(state,{
    isLoading: false,
    isLoaded: true,
    ids: action.payload.data.result
  })
})

export default combineReducers({
  actions: actionsReducer.getReducer(),
  recent: recentReducer.getReducer()
})
