import R from 'ramda'
import { push } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import { articleSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

import { toJSON, fromJSON } from '../vendor/dispatch-editor'

import PublishableActions from './PublishableActions'

class ArticlesActions extends PublishableActions {

  toRemote(data) {
    data = R.clone(data)

    // Convert article contentState to JSON array
    data.content = toJSON(data.content)

    data.section_id = data.section

    data.subsection_id = data.subsection

    data.author_ids = data.authors

    data.tag_ids = data.tags

    data.topic_id = data.topic

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

  search(author, section, tags, query) {
    let queryObj = {}

    if (query) {
      queryObj.q = query
    }

    if (section) {
      queryObj.section = section
    }

    if (tags) {
      queryObj.tags = tags
    }

    if (author) {
      queryObj.author = author
    }

    return (dispatch) => {
      dispatch(push({ pathname: '/articles/', query: queryObj }))
    }
  }

}

export default new ArticlesActions(
  types.ARTICLES,
  DispatchAPI.articles,
  articleSchema
)
