import R from 'ramda'
import { normalize, arrayOf } from 'normalizr'
import { push } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import { imageSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'
import { createPersonHelper } from './PersonsActions'

export function fetchImages(params) {
  return {
    type: types.FETCH_IMAGES,
    payload: DispatchAPI.images.fetchImages(params)
      .then( json => {
        return {
          count: json.count,
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

export function searchImages(query) {
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

export function addAuthorToImage(token, image, authorId) {
  let newAuthors = R.append(authorId, image.authors)
  let newImage = R.assoc('authors', newAuthors, image)

  return saveImage(token, image.id, newImage)
}

export function removeAuthorFromImage(token, image, authorId) {
  let newAuthors = R.remove(
    R.findIndex(R.equals(authorId), image.authors),
    1,
    image.authors
  )
  let newImage = R.assoc('authors', newAuthors, image)

  return saveImage(token, image.id, newImage)
}

export function createAndAddAuthorToImage(token, image, authorName) {
  return function(dispatch) {
    DispatchAPI.persons.createPerson(token, authorName)
      .then( person => {
        dispatch(createPersonHelper(person))
        dispatch(addAuthorToImage(token, image, person.id))
      })
  }
}

export function updateImage(imageId, image) {
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
