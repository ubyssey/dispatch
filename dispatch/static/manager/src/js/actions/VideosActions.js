import { push } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import { videoSchema } from '../constants/Schemas'

import DispatchAPI from '../api/dispatch'

import { ResourceActions } from '../util/redux'

class VideosActions extends ResourceActions {

  fromRemote(data) {
    // convert author from object to id
    for (let author of data.authors) {
      if (author.person && author.person.id) {
        author.person = author.person.id
      }
    }

    // convert tag from object to id
    for (let [i, tag] of data.tags.entries()) {
      if (tag.id) {
        data.tags[i] = tag.id
      }
    }

    return data
  }

  toRemote(data) {
    data.author_ids = data.authors ? data.authors : []
    
    data.tag_ids = data.tags ? data.tags : []
    
    return data
  }

  search(author, tags, query ) {
    let queryObj = {}

    if (author) {
      queryObj.author = author
    }

    if (tags) {
      queryObj.tags = tags
    }

    if (query) {
      queryObj.q = query
    }

    return dispatch => {
      dispatch(push({ pathname: '/videos/', query: queryObj }))
    }
  }

}

export default new VideosActions(
  types.VIDEOS,
  DispatchAPI.videos,
  videoSchema
)