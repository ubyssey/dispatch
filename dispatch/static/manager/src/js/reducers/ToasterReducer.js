import { Intent } from '@blueprintjs/core'

import * as types from '../constants/ActionTypes'
import { fulfilled, rejected } from '../util/redux'

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
  case fulfilled(types.SECTIONS.CREATE):
  case fulfilled(types.SECTIONS.SAVE):
    return showToast('Section saved')
  case rejected(types.SECTIONS.CREATE):
  case rejected(types.SECTIONS.SAVE):
    return showToast('Section could not be saved', Intent.DANGER)
  case fulfilled(types.SECTIONS.DELETE_MANY):
    return showToast(`${action.payload.length} section${action.payload.length > 1 ? 's' : ''} deleted`)
  case rejected(types.SECTIONS.DELETE_MANY):
    return showToast('Some sections could not be deleted', Intent.DANGER)

  // Articles
  case fulfilled(types.ARTICLES.CREATE):
  case fulfilled(types.ARTICLES.SAVE):
    return showToast('Article saved')
  case rejected(types.ARTICLES.CREATE):
  case rejected(types.ARTICLES.SAVE):
    return showToast('Article could not be saved', Intent.DANGER)
  case fulfilled(types.ARTICLES.DELETE_MANY):
    return showToast(`${action.payload.length} article${action.payload.length > 1 ? 's' : ''} deleted`)
  case rejected(types.ARTICLES.DELETE_MANY):
    return showToast('Some articles could not be deleted', Intent.DANGER)
  case fulfilled(types.ARTICLES.PUBLISH):
    return showToast('Article published')
  case rejected(types.ARTICLES.PUBLISH):
    return showToast('Article could not be published', Intent.DANGER)
  case fulfilled(types.ARTICLES.UNPUBLISH):
    return showToast('Article unpublished')
  case rejected(types.ARTICLES.UNPUBLISH):
    return showToast('Article could not be unpublished', Intent.DANGER)

  // // Pages
  // case `${types.SAVE_PAGE}_FULFILLED`:
  //   return showToast('Page saved')
  // case `${types.SAVE_PAGE}_REJECTED`:
  //   return showToast('Page could not be saved', Intent.DANGER)
  // case `${types.DELETE_PAGES}_FULFILLED`:
  //   return showToast(`${action.payload.length} pages deleted`)
  // case `${types.DELETE_PAGES}_REJECTED`:
  //   return showToast('Some pages could not be deleted', Intent.DANGER)
  // case `${types.PUBLISH_PAGE}_FULFILLED`:
  //   return showToast('Page published')
  // case `${types.PUBLISH_PAGE}_REJECTED`:
  //   return showToast('Page could not be published', Intent.DANGER)
  // case `${types.UNPUBLISH_PAGE}_FULFILLED`:
  //   return showToast('Page unpublished')
  // case `${types.UNPUBLISH_PAGE}_REJECTED`:
  //   return showToast('Page could not be unpublished', Intent.DANGER)
  //
  // // Images
  // case `${types.DELETE_IMAGE}_FULFILLED`:
  //   return showToast('Image deleted')
  // case `${types.DELETE_IMAGE}_REJECTED`:
  //   return showToast('Image could not be deleted', Intent.DANGER)
  //
  // // Image
  // case `${types.SAVE_IMAGE}_FULFILLED`:
  //   return showToast('Image saved')
  // case `${types.SAVE_IMAGE}_REJECTED`:
  //   return showToast('Image could not be saved', Intent.DANGER)
  // case `${types.CREATE_IMAGE}_FULFILLED`:
  //   return showToast('Image uploaded')
  // case `${types.CREATE_IMAGE}_REJECTED`:
  //   return showToast('Image could not be uploaded', Intent.DANGER)
  //
  // // Files
  // case `${types.CREATE_FILE}_FULFILLED`:
  //   return showToast('File uploaded')
  // case `${types.CREATE_FILE}_REJECTED`:
  //   return showToast('File could not be uploaded', Intent.DANGER)
  // case `${types.DELETE_FILES}_FULFILLED`:
  //   return showToast(`${action.payload.length} file${action.payload.length > 1 ? 's' : ''} deleted`)
  // case `${types.DELETE_FILES}_REJECTED`:
  //   return showToast('Some files could not be deleted', Intent.DANGER)
  //
  // // Integrations
  // case `${types.SAVE_INTEGRATION}_FULFILLED`:
  //   return showToast('Integration updated')
  // case `${types.DELETE_INTEGRATION}_FULFILLED`:
  //   return showToast('Integration removed')
  // case `${types.INTEGRATION_CALLBACK}_FULFILLED`:
  //   return showToast('Authentication successful')
  // case `${types.INTEGRATION_CALLBACK}_REJECTED`:
  //   return showToast(action.payload.detail, Intent.DANGER)
  default:
    return toaster

  }
}
