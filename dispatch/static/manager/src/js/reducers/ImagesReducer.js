import { combineReducers } from 'redux'
import R from 'ramda'

import * as types from '../constants/ActionTypes'

import { pending, fulfilled } from './ReducerHelpers'

const initialState = {
  list: {
    isLoading: false,
    isLoaded: false,
    count: null,
    next: null,
    previous: null,
    ids: []
  },
  single: {
    id: null
  }
}

function imagesListReducer(state = initialState.list, action) {
  switch (action.type) {

  case pending(types.IMAGES.LIST):
    return R.merge(state, {
      isLoading: true
    })
  case fulfilled(types.IMAGES.LIST):
    return R.merge(state, {
      isLoading: false,
      isLoaded: true,
      count: action.payload.count,
      next: action.payload.next,
      previous: action.payload.previous,
      ids: action.payload.append ? R.concat(state.ids, action.payload.results.result) : action.payload.results.result
    })
  case fulfilled(types.IMAGES.CREATE):
    return R.merge(state, {
      ids: R.concat([action.payload.result], state.ids)
    })
  case fulfilled(types.IMAGES.DELETE):
    return R.merge(state, {
      ids: R.without([action.payload.imageId], state.ids)
    })
  default:
    return state
  }
}

function imagesSingleReducer(state = initialState.single, action) {
  switch (action.type) {
  case types.IMAGES.SELECT:
    return R.merge(state, {
      id: action.imageId
    })
  case fulfilled(types.IMAGES.DELETE):
    if (action.payload.imageId == state.id) {
      return R.merge(state, {
        id: null
      })
    } else {
      return state
    }
  default:
    return state
  }
}

export default combineReducers({
  list: imagesListReducer,
  single: imagesSingleReducer
})
