import R from 'ramda'
import { normalize, arrayOf } from 'normalizr'

import { push } from 'react-router-redux'


import DispatchAPI from '../api/dispatch'
import * as types from '../constants/ActionTypes'
import {
  zoneSchema,
  widgetSchema,
} from '../constants/Schemas'

import * as fields from '../components/fields'

const schemaMap = initSchemaMap()

export function list(token, query) {
  return {
    type: types.ZONES.LIST,
    payload: DispatchAPI.zones.list(token, query)
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

export function search(query) {
  let queryObj = {}

  if (query) {
    queryObj.q = query
  }

  return (dispatch) => {
    dispatch(push({ pathname: '/widgets/', query: queryObj }))
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

function normalizeZoneData(field, data) {
  if (schemaMap.has(field.type)) {
    const schema = schemaMap.get(field.type)
    return field.many ? normalize(data, arrayOf(schema)) : normalize(data, schema)
  } else {
    return {
      result: data,
      entities: {}
    }
  }
}

function normalizeZone(zone, isNestedWidget=false) {
  const fields = R.path(['widget', 'fields'], zone) || []

  let fieldEntities = {}

  fields.forEach(field => {
    if (!zone.data || !zone.data[field.name]) {
      return
    }

    const normalizedData = normalizeZoneData(field, zone.data[field.name])

    fieldEntities = R.mergeWith(
      R.merge,
      fieldEntities,
      normalizedData.entities
    )

    if (field.type != 'widget') {
      zone.data[field.name] = normalizedData.result
    }
  })

  let result = !isNestedWidget ? normalize(zone, zoneSchema) : {}

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

function initSchemaMap() {
  var schemaMap = new Map()

  for (let fieldType in fields) {
    const field = fields[fieldType]
    if (field.schema) {
      schemaMap.set(field.type, field.schema)
    }
  }

  return schemaMap
}