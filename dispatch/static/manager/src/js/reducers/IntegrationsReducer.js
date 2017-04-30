import R from 'ramda'

import * as types from '../constants/ActionTypes'

import { fulfilled, Reducer } from '../util/redux'

const initialState = {
  integrations: {}
}

let reducer = new Reducer(initialState)

reducer.handle(fulfilled(types.INTEGRATIONS.CALLBACK), (state, action) => {
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
})

function handleSuccess(state, action) {
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
}

reducer.handle(fulfilled(types.INTEGRATIONS.GET), handleSuccess)
reducer.handle(fulfilled(types.INTEGRATIONS.SAVE), handleSuccess)
reducer.handle(fulfilled(types.INTEGRATIONS.UPDATE), handleSuccess)

reducer.handle(fulfilled(types.INTEGRATIONS.DELETE), (state, action) => {
  return R.merge(state, {
    integrations: R.assoc(
      action.payload.id,
      {},
      state.integrations
    )
  })
})

export default reducer.reduce
