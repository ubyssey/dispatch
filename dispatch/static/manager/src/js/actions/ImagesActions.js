import { normalize, arrayOf } from 'normalizr'

import * as types from '../constants/ActionTypes'
import { imageSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

export function fetchImagesPage(token, uri) {
  return {
    type: types.FETCH_IMAGES,
    payload: DispatchAPI.fetchPage(token, uri)
      .then( json => {
        return {
          count: json.count,
          next: json.next,
          previous: json.previous,
          append: true,
          results: normalize(json.results, arrayOf(imageSchema))
        }
      })
  }
}

export function fetchImages(token, params) {
  return {
    type: types.FETCH_IMAGES,
    payload: DispatchAPI.images.fetchImages(token, params)
      .then( json => {
        return {
          count: json.count,
          next: json.next,
          previous: json.previous,
          results: normalize(json.results, arrayOf(imageSchema))
        }
      })
  }
}

export function deleteImage(token, imageId) {
  return {
    type: types.DELETE_IMAGE,
    payload: DispatchAPI.images.deleteImage(token, imageId)
      .then( json => json.deleted )
  }
}

export function searchImages(token, query) {
  return {
    type: types.SEARCH_IMAGES,
    payload: DispatchAPI.images.searchImages(token, query)
      .then( json => {
        return {
          count: json.count,
          results: normalize(json.results, arrayOf(imageSchema))
        }
      })
  }
}

export function saveImage(token, imageId, data) {
  return {
    type: types.SAVE_IMAGE,
    payload: DispatchAPI.images.saveImage(token, imageId, data)
      .then( json => normalize(json, imageSchema) )
  }
}

export function updateImage(image) {
  return {
    type: types.UPDATE_IMAGE,
    payload: normalize(image, imageSchema)
  }
}

export function selectImage(imageId) {
  return {
    type: types.SELECT_IMAGE,
    imageId: imageId
  }
}
