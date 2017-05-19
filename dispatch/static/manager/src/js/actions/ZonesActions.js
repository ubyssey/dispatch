import { normalize, arrayOf } from 'normalizr'

import DispatchAPI from '../api/dispatch'
import * as types from '../constants/ActionTypes'
import { zoneSchema, widgetSchema } from '../constants/Schemas'

export function list(token) {
  return {
    type: types.ZONES.LIST,
    payload: DispatchAPI.zones.list(token)
      .then(json => ({
        count: json.count,
        data: normalize(json.results, arrayOf(zoneSchema))
      }))
  }
}

export function get(token, zoneId) {
  return {
    type: types.ZONES.GET,
    payload: DispatchAPI.zones.get(token, zoneId)
      .then(json => ({
        data: normalize(json, zoneSchema)
      }))
  }
}

export function set(data) {
  return {
    type: types.ZONES.SET,
    isLocalAction: true,
    payload: {
      data: normalize(data, zoneSchema)
    }
  }
}

export function save(token, zoneId, data) {
  return {
    type: types.ZONES.SAVE,
    payload: DispatchAPI.zones.save(token, zoneId, data)
      .then(json => ({
        data: normalize(json, zoneSchema)
      }))
  }
}

export function listWidgets(token, zoneId) {
  return {
    type: types.ZONES.LIST_WIDGETS,
    payload: DispatchAPI.zones.widgets(token, zoneId)
      .then(json => {
        console.log(json)
        return json
      })
      .then(json => ({
        count: json.count,
        data: normalize(json.results, arrayOf(widgetSchema))
      }))
  }
}
