import * as types from '../constants/ActionTypes'
import DispatchAPI from '../api/dispatch'

export function integrationCallback(token, integrationId, query) {
  return {
    type: types.INTEGRATIONS.CALLBACK,
    payload: DispatchAPI.integrations.callback(token, integrationId, query)
      .then(json => ({
        id: integrationId,
        data: json
      }))
  }
}

export function fetchIntegration(token, integrationId) {
  return {
    type: types.INTEGRATIONS.GET,
    payload: DispatchAPI.integrations.get(token, integrationId)
      .then(json => ({
        id: integrationId,
        data: json
      }))
  }
}

export function saveIntegration(token, integrationId, data) {
  return {
    type: types.INTEGRATIONS.SAVE,
    payload: DispatchAPI.integrations.save(token, integrationId, data)
      .then(json => ({
        id: integrationId,
        data: json
      }))
  }
}

export function deleteIntegration(token, integrationId) {
  return {
    type: types.INTEGRATIONS.DELETE,
    payload: DispatchAPI.integrations.delete(token, integrationId)
      .then(() => ({
        id: integrationId
      }))
  }
}

export function updateIntegration(integrationId, data) {
  return {
    type: types.INTEGRATIONS.UPDATE,
    payload: {
      id: integrationId,
      data: data
    }
  }
}
