import { Intent } from '@blueprintjs/core'

import * as types from '../constants/ActionTypes'

const DEFAULT_TIMEOUT = 2000

export default function toasterReducer(toaster = {}, action) {

  function showToast(message, intent=Intent.SUCCESS) {
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
    return showToast('Article saved')
  case `${types.SAVE_ARTICLE}_REJECTED`:
    return showToast('Article could not be saved', Intent.DANGER)

  // Images
  case `${types.DELETE_IMAGE}_FULFILLED`:
    return showToast('Image deleted')
  case `${types.DELETE_IMAGE}_REJECTED`:
    return showToast('Image could not be deleted', Intent.DANGER)

  // Image
  case `${types.SAVE_IMAGE}_FULFILLED`:
    return showToast('Image saved')
  case `${types.SAVE_IMAGE}_REJECTED`:
    return showToast('Image could not be saved', Intent.DANGER)
  case `${types.CREATE_IMAGE}_FULFILLED`:
    return showToast('Image uploaded')
  case `${types.CREATE_IMAGE}_REJECTED`:
    return showToast('Image could not be uploaded', Intent.DANGER)

  // Integrations
  case `${types.SAVE_INTEGRATION}_FULFILLED`:
    return showToast('Integration updated')
  case `${types.DELETE_INTEGRATION}_FULFILLED`:
    return showToast('Integration removed')
  case `${types.INTEGRATION_CALLBACK}_FULFILLED`:
    return showToast('Authentication successful')
  case `${types.INTEGRATION_CALLBACK}_REJECTED`:
    return showToast(action.payload.detail, Intent.DANGER)
  default:
    return toaster

  }
}
