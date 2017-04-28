import { normalize, arrayOf } from 'normalizr'
import { push } from 'react-router-redux'

export default class GenericActions {

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
        .then(json => normalize(json, this.schema))
    }
  }

  list(token, params) {
    return {
      type: this.types.LIST,
      payload: this.api.list(token, params)
        .then(json => ({
          count: json.count,
          results: normalize(json.results, arrayOf(this.schema))
        }))
    }
  }

  save(token, id, data) {
    return {
      type: this.types.SAVE,
      payload: this.api.save(token, id, this.prepareData(data))
        .then(json => normalize(json, this.schema))
    }
  }

  create(token, id, data) {
    return {
      type: this.types.CREATE,
      payload: this.api.create(token, this.dataAdapter(data))
        .then(json => normalize(json, this.schema))
    }
  }

  delete(token, id, next=null) {
    return (dispatch) => {

      dispatch({ type: `${this.types.DELETE}_PENDING` })

      this.api.delete(token, id)
        .then(() => {
          if (next) {
            dispatch(push(next))
          }
        })
        .then(() => {
          dispatch({
            type: `${this.types.DELETE}_FULFILLED`,
            payload: id
          })
        })
        .catch(error => {
          dispatch({
            type: `${this.types.DELETE}_REJECTED`,
            payload: error
          })
        })
    }
  }

  deleteMany(token, ids) {
    return (dispatch) => {
      dispatch({ type: `${this.types.DELETE_MANY}_PENDING` })

      Promise.all(
        ids.map(id => this.api.delete(token, id))
      )
      .then(() => {
        dispatch({
          type: `${this.types.DELETE_MANY}_FULFILLED`,
          payload: ids
        })
      })
      .catch(error => {
        dispatch({
          type: `${this.types.DELETE_MANY}_REJECTED`,
          payload: error
        })
      })
    }
  }

  set(resource) {
    return {
      type: this.types.SET,
      payload: normalize(resource, this.schema)
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
