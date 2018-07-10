import R from 'ramda'
import { push } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import { columnSchema } from '../constants/Schemas'

import DispatchAPI from '../api/dispatch'

import { ResourceActions } from '../util/redux'

class ColumnsActions extends ResourceActions {

  toRemote(data) {
    data = R.clone(data)

    data.section_id = data.section ? data.section.id : null

    data.author_ids = data.authors

    let article_ids = []

    for (var article in data.articles) {
      article_ids.push(data.articles[article].id)
    }

    data.article_ids = article_ids

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

    return dispatch => {
      dispatch(push({ pathname: '/columns/', query: queryObj }))
    }
  }
}

export default new ColumnsActions(
  types.COLUMNS,
  DispatchAPI.columns,
  columnSchema
)
