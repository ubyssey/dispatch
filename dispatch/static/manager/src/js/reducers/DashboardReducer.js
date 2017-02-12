import R from 'ramda';
import { combineReducers } from 'redux'

import * as types from '../constants/ActionTypes'

const initialState = {
  actions: {
    isLoading: false,
    isLoaded: false,
    data: []
  },
  recent: {
    isLoading: false,
    isLoaded: false,
    data: []
  }
}

let actionsReducer = (state = initialState.actions, action) => {
  switch(action.type) {
    case `${types.FETCH_ACTIONS}_PENDING`:
      return R.merge(state,{
        isLoading: true
      })
    case `${types.FETCH_ACTIONS}_FULFILLED`:
      return R.merge(state,{
        isLoading: false,
        isLoaded: true,
        data: action.payload.results
      })
    default:
      return state
  }
}

let recentReducer = (state = initialState.recent, action) => {
  switch (action.type) {
    case `${types.FETCH_RECENT}_PENDING`:
      return R.merge(state, {
        isLoading: true
      })
    case `${types.FETCH_RECENT}_FULFILLED`:
      const data = Object.keys(action.payload.entities.articles).map((elem) => ({
        id: elem,
        headline: action.payload.entities.articles[elem].headline
      }));

      return R.merge(state,{
        isLoading: false,
        isLoaded: true,
        data: data
      })
    default:
      return state
  }
}

export default combineReducers({
  actions: actionsReducer,
  recent: recentReducer
})
