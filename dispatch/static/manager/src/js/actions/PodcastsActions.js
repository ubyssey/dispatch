import R from 'ramda'
import { push } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import { podcastSchema } from '../constants/Schemas'

import DispatchAPI from '../api/dispatch'

import { ResourceActions } from '../util/redux'

class PodcastsActions extends ResourceActions {

  toRemote(data) {
    data = R.clone(data)

    data.image_id = data.image

    return data
  }

  search(query) {
    let queryObj = {}

    if (query) {
      queryObj.q = query
    }

    return dispatch => {
      dispatch(push({ pathname: '/podcasts/podcasts/', query: queryObj }))
    }
  }

}

export default new PodcastsActions(
  types.PODCASTS,
  DispatchAPI.podcasts.podcasts,
  podcastSchema
)
