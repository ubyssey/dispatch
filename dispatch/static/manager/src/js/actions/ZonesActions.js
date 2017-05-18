import { normalize, arrayOf } from 'normalizr'

import DispatchAPI from '../api/dispatch'
import * as types from '../constants/ActionTypes'
import { zoneSchema, widgetSchema } from '../constants/Schemas'

export function listZones(token) {
  return {
    type: types.ZONES.LIST,
    payload: DispatchAPI.zones.list(token)
      .then(json => ({
        count: json.count,
        data: normalize(json.results, arrayOf(zoneSchema))
      }))
  }
}

export function getZone(token, zoneId) {
  return {
    type: types.ZONES.GET,
    payload: DispatchAPI.zones.get(token, zoneId)
      .then(json => ({
        data: normalize(json, zoneSchema)
      }))
  }
}

export function saveZone(token, zoneId, data) {
  return {
    type: types.ZONES.SAVE,
    payload: DispatchAPI.zones.save(token, zoneId, data)
      .then(json => ({
        data: normalize(json, zoneSchema)
      }))
  }
}

export function getZoneWidgets(token, zoneId) {
  return {
    type: types.ZONES.WIDGETS,
    payload: DispatchAPI.zones.widgets(token, zoneId)
      .then(json => ({
        count: json.count
        data: normalize(json.results, arrayOf(zoneSchema))
      }))
  }
}
