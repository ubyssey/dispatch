import { combineReducers } from 'redux'
import R from 'ramda';

import * as types from '../constants/ActionTypes'

const initialState = {
  images: {
    isLoading: false,
    isLoaded: false,
    count: null,
    data: []
  },
  image: {
    data: null
  }
}

function imagesReducer(state = initialState.images, action) {
  switch (action.type) {
    case types.FETCH_IMAGES + '_PENDING':
      return R.merge(state, {
        isLoading: true
      })
    case types.FETCH_IMAGES + '_FULFILLED':
      return R.merge(state, {
        isLoading: false,
        isLoaded: true,
        count: action.payload.count,
        data: action.payload.results.result
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
    default:
      return state
  }
}

export default combineReducers({
  images: imagesReducer,
  image: imageReducer
})
