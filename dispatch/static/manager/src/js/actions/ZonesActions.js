import R from 'ramda'
import { normalize, arrayOf } from 'normalizr'

import DispatchAPI from '../api/dispatch'
import * as types from '../constants/ActionTypes'
import {
  zoneSchema,
  widgetSchema,
  articleSchema,
  imageSchema,
  eventSchema
} from '../constants/Schemas'

function normalizeZoneData(field, data) {
  switch (field.type) {
  case 'article':
    return field.many ? normalize(data, arrayOf(articleSchema)) : normalize(data, articleSchema)
  case 'image':
    return field.many ? normalize(data, arrayOf(imageSchema)) : normalize(data, imageSchema)
  case 'event':
    return field.many ? normalize(data, arrayOf(eventSchema)) : normalize(data, eventSchema)
  default:
    return {
      result: data,
      entities: {}
    }
  }
}

function normalizeZone(zone) {
  const fields = R.path(['widget', 'fields'], zone) || []

  let fieldEntities = {}

  fields.forEach(field => {
    if (!zone || !zone.data[field.name]) {
      return
    }

    const normalizedData = normalizeZoneData(field, zone.data[field.name])

    fieldEntities = R.mergeWith(
      R.merge,
      fieldEntities,
      normalizedData.entities
    )

    zone.data[field.name] = normalizedData.result
  })

  let result = normalize(zone, zoneSchema)

  result.entities = R.mergeWith(
    R.merge,
    result.entities,
    fieldEntities
  )

  return result
}

function normalizeZones(zones) {
  let results = []
  let entities = {}

  zones.forEach(zone => {
    const normalizedData = normalizeZone(zone)
    results.push(normalizedData.result)

    entities = R.mergeWith(
      R.merge,
      entities,
      normalizedData.entities
    )
  })

  return {
    result: results,
    entities: entities
  }
}

export function list(token) {
  return {
    type: types.ZONES.LIST,
    payload: DispatchAPI.zones.list(token)
      .then(json => ({
        count: json.count,
        data: normalizeZones(json.results)
      }))
  }
}

export function get(token, zoneId) {
  return {
    type: types.ZONES.GET,
    payload: DispatchAPI.zones.get(token, zoneId)
      .then(json => ({
        data: normalizeZone(json)
      }))
  }
}

export function set(data) {
  return {
    type: types.ZONES.SET,
    isLocalAction: true,
    payload: {
      data: normalizeZone(data)
    }
  }
}

export function save(token, zoneId, data) {
  return {
    type: types.ZONES.SAVE,
    payload: DispatchAPI.zones.save(token, zoneId, data)
      .then(json => ({
        data: normalizeZone(json)
      }))
  }
}

export function listWidgets(token, zoneId) {
  return {
    type: types.ZONES.LIST_WIDGETS,
    payload: DispatchAPI.zones.widgets(token, zoneId)
      .then(json => {
        return json
      })
      .then(json => ({
        count: json.count,
        data: normalize(json.results, arrayOf(widgetSchema)),
        zoneId
      }))
  }
}
