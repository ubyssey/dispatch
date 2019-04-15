import { push } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import DispatchAPI from '../api/dispatch'
import { notificationSchema } from '../constants/Schemas'

import { ResourceActions } from '../util/redux'

class NotificationsActions extends ResourceActions {

  search(query) {
    let queryObj = {}

    if (query) {
      queryObj.q = query
    }

    return (dispatch) => {
      dispatch(push({ pathname: '/notifications/', query: queryObj }))
    }
  }

}

export default new NotificationsActions(
  types.NOTIFICATIONS,
  DispatchAPI.notifications,
  notificationSchema
)