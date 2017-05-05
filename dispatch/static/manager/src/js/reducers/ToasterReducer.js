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

  // Pages
  case fulfilled(types.PAGES.CREATE):
  case fulfilled(types.PAGES.SAVE):
    return showToast('Page saved')
  case rejected(types.PAGES.CREATE):
  case rejected(types.PAGES.SAVE):
    return showToast('Page could not be saved', Intent.DANGER)
  case fulfilled(types.PAGES.DELETE_MANY):
    return showToast(`${action.payload.length} page${action.payload.length > 1 ? 's' : ''} deleted`)
  case rejected(types.PAGES.DELETE_MANY):
    return showToast('Some pages could not be deleted', Intent.DANGER)
  case fulfilled(types.PAGES.PUBLISH):
    return showToast('Page published')
  case rejected(types.PAGES.PUBLISH):
    return showToast('Page could not be published', Intent.DANGER)
  case fulfilled(types.PAGES.UNPUBLISH):
    return showToast('Page unpublished')
  case rejected(types.PAGES.UNPUBLISH):
    return showToast('Page could not be unpublished', Intent.DANGER)

  // Images
  case fulfilled(types.IMAGES.SAVE):
    return showToast('Image saved')
  case rejected(types.IMAGES.SAVE):
    return showToast('Image could not be saved', Intent.DANGER)
  case fulfilled(types.IMAGES.CREATE):
    return showToast('Image uploaded')
  case rejected(types.IMAGES.CREATE):
    return showToast('Image could not be uploaded', Intent.DANGER)
  case fulfilled(types.IMAGES.DELETE):
    return showToast('Image deleted')
  case rejected(types.IMAGES.DELETE):
    return showToast('Image could not be deleted', Intent.DANGER)

  // Files
  case fulfilled(types.FILES.CREATE):
    return showToast('File uploaded')
  case rejected(types.FILES.CREATE):
    return showToast('File could not be uploaded', Intent.DANGER)
  case fulfilled(types.FILES.DELETE_MANY):
    return showToast(`${action.payload.length} file${action.payload.length > 1 ? 's' : ''} deleted`)
  case rejected(types.FILES.DELETE_MANY):
    return showToast('Some files could not be deleted', Intent.DANGER)

  // Integrations
  case fulfilled(types.INTEGRATIONS.SAVE):
    return showToast('Integration updated')
  case fulfilled(types.INTEGRATIONS.DELETE):
    return showToast('Integration removed')
  case fulfilled(types.INTEGRATIONS.CALLBACK):
    return showToast('Authentication successful')
  case rejected(types.INTEGRATIONS.CALLBACK):
    return showToast(action.payload.detail, Intent.DANGER)
  default:
    return toaster

  }
}
