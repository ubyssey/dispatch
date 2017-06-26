import { push } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import { pageSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

import PublishableActions from './PublishableActions'

import { toJSON } from '../vendor/dispatch-editor'

class PagesActions extends PublishableActions {

  toRemote(data) {
    if (data._content) {
      // Convert page contentState to JSON array
      data.content = toJSON(data._content)
      delete data._content
    }

    data.template_id = data.template
    delete data.template

    if (data.featured_image) {
      data.featured_image.image_id = data.featured_image.image
    }

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
