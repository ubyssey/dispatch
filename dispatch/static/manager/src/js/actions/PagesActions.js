import R from 'ramda'
import { push } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import { pageSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

import PublishableActions from './PublishableActions'

import { toJSON, fromJSON } from '../vendor/dispatch-editor'

class PagesActions extends PublishableActions {

  toRemote(data) {
    data = R.clone(data)

    data.content = toJSON(data.content)

    data.template_id = data.template
    delete data.template
    
    if (data.featured_video) {
      data.featured_video.video_id = data.featured_video.video
    }

    if (data.featured_image) {
      data.featured_image.image_id = data.featured_image.image
    }

    return data
  }

  fromRemote(data) {
    data.content = fromJSON(data.content)
    return data
  }

  search(section, query) {
    let queryObj = {}

    if (query) {
      queryObj.q = query
    }

    if (section) {
      queryObj.section = section
    }

    return (dispatch) => {
      dispatch(push({ pathname: '/pages/', query: queryObj }))
    }
  }

}

export default new PagesActions(
  types.PAGES,
  DispatchAPI.pages,
  pageSchema
)
