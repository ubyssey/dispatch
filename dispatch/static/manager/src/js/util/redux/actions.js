import R from 'ramda'
import { normalize, arrayOf } from 'normalizr'
import { push } from 'react-router-redux'

import DispatchAPI from '../../api/dispatch'

export function pending(actionType) { return `${actionType}_PENDING` }
export function fulfilled(actionType) { return `${actionType}_FULFILLED` }
export function rejected(actionType) { return `${actionType}_REJECTED` }

const DEFAULT_RESOURCE_ACTION_TYPES = [
  'LIST',
  'GET',
  'SAVE',
  'CREATE',
  'DELETE',
  'DELETE_MANY',
  'SET',
  'TOGGLE',
  'TOGGLE_ALL',
  'SELECT',
  'CLEAR_SELECTED',
  'CLEAR_ALL'
]

/**
 * Utility to generate an action type object from a list of action types.
 */
export function actionTypes(prefix, actionTypes) {
  return actionTypes.reduce(
    (acc, action) => R.assoc(action, `${prefix}_${action}`, acc),
    {}
  )
}

/**
 * Utility to generate generic resource action types. Additional action types
 * can be passed through the `extraActionTypes` parameter.
 *
 * i.e. resourceActionTypes('BOOKS') generates:
 *
 *  {
 *    LIST: 'BOOKS_LIST',
 *    GET: 'BOOKS_GET',
 *    SAVE: 'BOOKS_SAVE'
 *    ...
 *  }
 */
export function resourceActionTypes(prefix, extraActionTypes=[]) {
  return actionTypes(
    prefix,
    R.concat(DEFAULT_RESOURCE_ACTION_TYPES, extraActionTypes)
  )
}

export class ResourceActions {

  constructor(types, api, schema) {
    this.types = types
    this.api = api
    this.schema = schema
  }

  prepareData(data) {
    return data
  }

  get(token, id, params) {
    return {
      type: this.types.GET,
      payload: this.api.get(token, id, params)
        .then(json => ({
          data: normalize(json, this.schema)
        }))
    }
  }

  list(token, params) {
    return {
      type: this.types.LIST,
      payload: this.api.list(token, params)
        .then(json => ({
          count: json.count,
          data: normalize(json.results, arrayOf(this.schema))
        }))
    }
  }

  listPage(token, uri) {
    return {
      type: this.types.LIST,
      payload: DispatchAPI.fetchPage(token, uri)
        .then(json => ({
          count: json.count,
          next: json.next,
          previous: json.previous,
          append: true,
          data: normalize(json.results, arrayOf(this.schema))
        }))
    }
  }

  save(token, id, data) {
    return {
      type: this.types.SAVE,
      payload: this.api.save(token, id, this.prepareData(data))
        .then(json => ({
          data: normalize(json, this.schema)
        }))
    }
  }

  create(token, id, data) {
    return {
      type: this.types.CREATE,
      payload: this.api.create(token, this.prepareData(data))
        .then(json => ({
          data: normalize(json, this.schema)
        }))
    }
  }

  delete(token, id, next=null) {
    return (dispatch) => {

      dispatch({ type: pending(this.types.DELETE) })

      this.api.delete(token, id)
        .then(() => {
          if (next) {
            dispatch(push(next))
          }
        })
        .then(() => {
          dispatch({
            type: fulfilled(this.types.DELETE),
            payload: id
          })
        })
        .catch(error => {
          dispatch({
            type: rejected(this.types.DELETE),
            payload: error
          })
        })
    }
  }

  deleteMany(token, ids) {
    return (dispatch) => {
      dispatch({ type: pending(this.types.DELETE_MANY) })

      Promise.all(
        ids.map(id => this.api.delete(token, id))
      )
      .then(() => {
        dispatch({
          type: fulfilled(this.types.DELETE_MANY),
          payload: ids
        })
      })
      .catch(error => {
        dispatch({
          type: rejected(this.types.DELETE_MANY),
          payload: error
        })
      })
    }
  }

  set(resource) {
    return {
      type: this.types.SET,
      isLocalAction: true,
      payload: {
        data: normalize(resource, this.schema)
      }
    }
  }

  toggle(ids) {
    return {
      type: this.types.TOGGLE,
      id: ids
    }
  }

  toggleAll(ids) {
    return {
      type: this.types.TOGGLE_ALL,
      ids: ids
    }
  }

  select(id) {
    return {
      type: this.types.SELECT,
      id: id
    }
  }

  clearSelected() {
    return {
      type: this.types.CLEAR_SELECTED
    }
  }

  clearAll() {
    return {
      type: this.types.CLEAR_ALL
    }
  }

}
