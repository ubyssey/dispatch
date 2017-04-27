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

  // Sections
  case `${types.CREATE_SECTION}_FULFILLED`:
  case `${types.SAVE_SECTION}_FULFILLED`:
    return showToast('Section saved')
  case `${types.CREATE_SECTION}_REJECTED`:
  case `${types.SAVE_SECTION}_REJECTED`:
    return showToast('Section could not be saved', Intent.DANGER)
  case `${types.DELETE_SECTIONS}_FULFILLED`:
    return showToast(`${action.payload.length} section${action.payload.length > 1 ? 's' : ''} deleted`)
  case `${types.DELETE_SECTIONS}_REJECTED`:
    return showToast('Some sections could not be deleted', Intent.DANGER)

  // Articles
  case `${types.CREATE_ARTICLE}_FULFILLED`:
  case `${types.SAVE_ARTICLE}_FULFILLED`:
    return showToast('Article saved')
  case `${types.CREATE_ARTICLE}_REJECTED`:
  case `${types.SAVE_ARTICLE}_REJECTED`:
    return showToast('Article could not be saved', Intent.DANGER)
  case `${types.DELETE_ARTICLES}_FULFILLED`:
    return showToast(`${action.payload.length} article${action.payload.length > 1 ? 's' : ''} deleted`)
  case `${types.DELETE_ARTICLES}_REJECTED`:
    return showToast('Some articles could not be deleted', Intent.DANGER)
  case `${types.PUBLISH_ARTICLE}_FULFILLED`:
    return showToast('Article published')
  case `${types.PUBLISH_ARTICLE}_REJECTED`:
    return showToast('Article could not be published', Intent.DANGER)
  case `${types.UNPUBLISH_ARTICLE}_FULFILLED`:
    return showToast('Article unpublished')
  case `${types.UNPUBLISH_ARTICLE}_REJECTED`:
    return showToast('Article could not be unpublished', Intent.DANGER)

  // Pages
  case `${types.SAVE_PAGE}_FULFILLED`:
    return showToast('Page saved')
  case `${types.SAVE_PAGE}_REJECTED`:
    return showToast('Page could not be saved', Intent.DANGER)
  case `${types.DELETE_PAGES}_FULFILLED`:
    return showToast(`${action.payload.length} pages deleted`)
  case `${types.DELETE_PAGES}_REJECTED`:
    return showToast('Some pages could not be deleted', Intent.DANGER)
  case `${types.PUBLISH_PAGE}_FULFILLED`:
    return showToast('Page published')
  case `${types.PUBLISH_PAGE}_REJECTED`:
    return showToast('Page could not be published', Intent.DANGER)
  case `${types.UNPUBLISH_PAGE}_FULFILLED`:
    return showToast('Page unpublished')
  case `${types.UNPUBLISH_PAGE}_REJECTED`:
    return showToast('Page could not be unpublished', Intent.DANGER)

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

  // Files
  case `${types.CREATE_FILE}_FULFILLED`:
    return showToast('File uploaded')
  case `${types.CREATE_FILE}_REJECTED`:
    return showToast('File could not be uploaded', Intent.DANGER)
  case `${types.DELETE_FILES}_FULFILLED`:
    return showToast(`${action.payload.length} file${action.payload.length > 1 ? 's' : ''} deleted`)
  case `${types.DELETE_FILES}_REJECTED`:
    return showToast('Some files could not be deleted', Intent.DANGER)

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
