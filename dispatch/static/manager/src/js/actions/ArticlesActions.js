import { push } from 'react-router-redux'

import PublishableActions from './PublishableActions'
import * as types from '../constants/ActionTypes'
import { articleSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

import ContentStateHelper from '../components/ContentEditor/ContentStateHelper'

class ArticlesActions extends PublishableActions {

  prepareData(data) {
    if (data._content) {
      // Convert article contentState to JSON array
      data.content = ContentStateHelper.toJSON(data._content)
      delete data._content
    }

    data.section_id = data.section

    data.author_ids = data.authors

    data.tag_ids = data.tags

    data.topic_id = data.topic

    data.template_id = data.template
    delete data.template

    if (data.featured_image) {
      data.featured_image.image_id = data.featured_image.image
    }

    return data
  }

  search(section, query) {
    var queryObj = {}

    if (query) {
      queryObj.q = query
    }

    if (section) {
      queryObj.section = section
    }

    return function(dispatch) {
      dispatch(push({ pathname: '/articles/', query: queryObj }))
    }
  }

}

export default new ArticlesActions(
  types.ARTICLES,
  DispatchAPI.articles,
  articleSchema
)
