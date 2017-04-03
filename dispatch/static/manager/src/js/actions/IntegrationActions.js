import * as types from '../constants/ActionTypes'
import DispatchAPI from '../api/dispatch'

export function integrationCallback(token, integrationId, query) {
  return {
    type: types.INTEGRATION_CALLBACK,
    payload: DispatchAPI.integrations.callback(token, integrationId, query)
      .then(function(json) {
        return {
          id: integrationId,
          data: json
        }
      })
  }
}

export function fetchIntegration(token, integrationId) {
  return {
    type: types.FETCH_INTEGRATION,
    payload: DispatchAPI.integrations.fetchIntegration(token, integrationId)
      .then(function(json) {
        return {
          id: integrationId,
          data: json
        }
      })
  }
}

export function saveIntegration(token, integrationId, data) {
  return {
    type: types.SAVE_INTEGRATION,
    payload: DispatchAPI.integrations.saveIntegration(token, integrationId, data)
      .then(function(json) {
        return {
          id: integrationId,
          data: json
        }
      })
  }
}

export function deleteIntegration(token, integrationId) {
  return {
    type: types.DELETE_INTEGRATION,
    payload: DispatchAPI.integrations.deleteIntegration(token, integrationId)
      .then(function() {
        return {
          id: integrationId
        }
      })
  }
}

export function updateIntegration(integrationId, data) {
  return {
    type: types.UPDATE_INTEGRATION,
    payload: {
      id: integrationId,
      data: data
    }
  }
}
