import { Intent } from '@blueprintjs/core'

import * as types from '../constants/ActionTypes'

const DEFAULT_TIMEOUT = 2000

export default function toasterReducer(toaster = {}, action) {

  function showToaster(message, intent=Intent.SUCCESS) {
    toaster.show({
      message: message,
      intent: intent,
      timeout: DEFAULT_TIMEOUT
    })
    return toaster
  }

  switch (action.type) {
  // Setup initial toaster
  case types.SETUP_TOASTER:
    return action.toaster

  // Article
  case `${types.SAVE_ARTICLE}_FULFILLED`:
    return showToaster('Article saved')
  case `${types.SAVE_ARTICLE}_REJECTED`:
    return showToaster('Article could not be saved', Intent.DANGER)

  // Images
  case `${types.DELETE_IMAGE}_FULFILLED`:
    return showToaster('Image deleted')
  case `${types.DELETE_IMAGE}_REJECTED`:
    return showToaster('Image could not be deleted', Intent.DANGER)

  // Image
  case `${types.SAVE_IMAGE}_FULFILLED`:
    return showToaster('Image saved')
  case `${types.SAVE_IMAGE}_REJECTED`:
    return showToaster('Image could not be saved', Intent.DANGER)
  case `${types.CREATE_IMAGE}_FULFILLED`:
    return showToaster('Image uploaded')
  case `${types.CREATE_IMAGE}_REJECTED`:
    return showToaster('Image could not be uploaded', Intent.DANGER)

  // Integrations
  case `${types.SAVE_INTEGRATION}_FULFILLED`:
    return showToaster('Integration updated')
  case `${types.DELETE_INTEGRATION}_FULFILLED`:
    return showToaster('Integration removed')
  case `${types.INTEGRATION_CALLBACK}_FULFILLED`:
    return showToaster('Authentication successful')
  case `${types.INTEGRATION_CALLBACK}_REJECTED`:
    return showToaster(action.payload.detail, Intent.DANGER)
  default:
    return toaster

  }
}
