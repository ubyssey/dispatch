import R from 'ramda'
import { combineReducers } from 'redux'

import * as types from '../constants/ActionTypes'

import {
  Reducer,
  fulfilled,
  rejected,
  buildManyResourceReducer,
  buildSingleResourceReducer
} from '../util/redux'

const INITIAL_STATE = {
  'id': '',
  'email': '',
  'permissions': '',
  'isNew': true
}

let userReducer = new Reducer(INITIAL_STATE)

userReducer.handle(fulfilled(types.PERSONS.GET_USER), (state, action) => {
  return action.payload
})

userReducer.handle(types.PERSONS.SET_USER, (state, action) => {
  return R.merge(state, action.user)
})

userReducer.handle(rejected(types.PERSONS.GET_USER), () => {
  return INITIAL_STATE
})

let inviteReducer = new Reducer(INITIAL_STATE)

inviteReducer.handle(fulfilled(types.PERSONS.GET_INVITE), (state, action) => {
  return action.payload
})

inviteReducer.handle(fulfilled(types.INVITES.CREATE), (state, action) => {
  return action.payload.data.entities.invites[action.payload.data.result]
})

inviteReducer.handle(types.PERSONS.SET_INVITE, (state, action) => {
  return R.merge(state, action.invite)
})

userReducer.handle(rejected(types.PERSONS.GET_INVITE), () => {
  return INITIAL_STATE
})

export default combineReducers({
  list: buildManyResourceReducer(types.PERSONS).getReducer(),
  single: buildSingleResourceReducer(types.PERSONS).getReducer(),
  user: userReducer.getReducer(),
  invite: inviteReducer.getReducer()
})
