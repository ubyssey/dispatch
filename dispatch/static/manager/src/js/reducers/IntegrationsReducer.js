import R from 'ramda';

import * as types from '../constants/ActionTypes'

const initialState = {
  integrations: {}
}

export default function integrationsReducer(state = initialState, action) {
  switch (action.type) {
    case types.INTEGRATION_CALLBACK + '_FULFILLED':
      return R.merge(state, {
        integrations: R.assoc(
          action.payload.id,
          R.merge(
            R.prop(action.payload.id, state.integrations),
            { callback: action.payload.data }
          ),
          state.integrations
        )
      })
    case types.FETCH_INTEGRATION + '_FULFILLED':
    case types.SAVE_INTEGRATION + '_FULFILLED':
    case types.UPDATE_INTEGRATION:
      return R.merge(state, {
        integrations: R.assoc(
          action.payload.id,
          R.merge(
            R.prop(action.payload.id, state.integrations),
            action.payload.data
          ),
          state.integrations
        )
      })
    case types.DELETE_INTEGRATION + '_FULFILLED':
      return R.merge(state, {
        integrations: R.assoc(
          action.payload.id,
          {},
          state.integrations
        )
      })
    default:
      return state
  }
}
