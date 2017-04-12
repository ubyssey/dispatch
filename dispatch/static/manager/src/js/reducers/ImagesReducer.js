import { combineReducers } from 'redux'
import R from 'ramda'

import * as types from '../constants/ActionTypes'

const initialState = {
  images: {
    isLoading: false,
    isLoaded: false,
    count: null,
    next: null,
    previous: null,
    data: []
  },
  image: {
    data: null
  }
}

function imagesReducer(state = initialState.images, action) {
  switch (action.type) {

  case `${types.FETCH_IMAGES}_PENDING`:
    return R.merge(state, {
      isLoading: true
    })
  case `${types.FETCH_IMAGES}_FULFILLED`:
    return R.merge(state, {
      isLoading: false,
      isLoaded: true,
      count: action.payload.count,
      next: action.payload.next,
      previous: action.payload.previous,
      data: action.payload.append ? R.concat(state.data, action.payload.results.result) : action.payload.results.result
    })
  case `${types.DELETE_IMAGE}_FULFILLED`:
    return R.merge(state, {
      data: R.without([action.payload.imageId], state.data)
    })
  default:
    return state
  }
}

function imageReducer(state = initialState.image, action) {
  switch (action.type) {
  case types.SELECT_IMAGE:
    return R.merge(state, {
      data: action.imageId
    })
  case `${types.DELETE_IMAGE}_FULFILLED`:
    if (action.payload.imageId == state.data) {
      return R.merge(state, {
        data: null
      })
    } else {
      return state
    }
  default:
    return state
  }
}

export default combineReducers({
  images: imagesReducer,
  image: imageReducer
})
