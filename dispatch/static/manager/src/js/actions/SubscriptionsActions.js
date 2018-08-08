import { push } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import DispatchAPI from '../api/dispatch'
import { subscriptionSchema } from '../constants/Schemas'

import { ResourceActions } from '../util/redux'

class SubscriptionsActions extends ResourceActions {

  search(query) {
    let queryObj = {}

    if (query) {
      queryObj.q = query
    }

    return (dispatch) => {
      dispatch(push({ pathname: '/subscriptions/', query: queryObj }))
    }
  }

}

export default new SubscriptionsActions(
  types.SUBSCRIPTIONS,
  DispatchAPI.subscriptions,
  subscriptionSchema
)
