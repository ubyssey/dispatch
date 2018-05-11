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

  // Tags
  case fulfilled(types.TAGS.CREATE):
  case fulfilled(types.TAGS.SAVE):
    return showToast('Tag saved')
  case rejected(types.TAGS.CREATE):
  case rejected(types.TAGS.SAVE):
    return showToast('Tag could not be saved', Intent.DANGER)
  case fulfilled(types.TAGS.DELETE_MANY):
    return showToast(`${action.payload.length} tag${action.payload.length > 1 ? 's' : ''} deleted`)
  case rejected(types.TAGS.DELETE_MANY):
    return showToast('Some tags could not be deleted', Intent.DANGER)

  // Topics
  case fulfilled(types.TOPICS.CREATE):
  case fulfilled(types.TOPICS.SAVE):
    return showToast('Topic saved')
  case rejected(types.TOPICS.CREATE):
  case rejected(types.TOPICS.SAVE):
    return showToast('Topic could not be saved', Intent.DANGER)
  case fulfilled(types.TOPICS.DELETE_MANY):
    return showToast(`${action.payload.length} topic${action.payload.length > 1 ? 's' : ''} deleted`)
  case rejected(types.TOPICS.DELETE_MANY):
    return showToast('Some topics could not be deleted', Intent.DANGER)

  // Zones
  case fulfilled(types.ZONES.SAVE):
    return showToast('Zone saved')
  case rejected(types.ZONES.SAVE):
    return showToast('Zone could not be saved', Intent.DANGER)

  // Persons
  case fulfilled(types.PERSONS.CREATE):
  case fulfilled(types.PERSONS.SAVE):
    return showToast('Person saved')
  case rejected(types.PERSONS.CREATE):
  case rejected(types.PERSONS.SAVE):
    return showToast('Person could not be saved', Intent.DANGER)
  case fulfilled(types.PERSONS.DELETE):
    return showToast('Person deleted')
  case rejected(types.PERSONS.DELETE):
    if (action.payload === 'Conflict') {
      return showToast('Can not delete currently logged in person', Intent.DANGER)
    } else {
      return showToast('Could not delete person', Intent.DANGER)
    }
  case fulfilled(types.PERSONS.DELETE_MANY):
    return showToast(`${action.payload.length} persons${action.payload.length > 1 ? 's' : ''} deleted`)
  case rejected(types.PERSONS.DELETE_MANY):
    return showToast('Some persons could not be deleted', Intent.DANGER)

  // Galleries
  case fulfilled(types.GALLERIES.CREATE):
  case fulfilled(types.GALLERIES.SAVE):
    return showToast('Gallery saved')
  case rejected(types.GALLERIES.CREATE):
  case rejected(types.GALLERIES.SAVE):
    return showToast('Gallery could not be saved', Intent.DANGER)
  case fulfilled(types.GALLERIES.DELETE_MANY):
    return showToast(`${action.payload.length} galler${action.payload.length > 1 ? 'ies' : 'y'} deleted`)
  case rejected(types.GALLERIES.DELETE_MANY):
    return showToast('Some galleries could not be deleted', Intent.DANGER)

  // Events
  case fulfilled(types.EVENTS.CREATE):
  case fulfilled(types.EVENTS.SAVE):
    return showToast('Event saved')
  case rejected(types.EVENTS.CREATE):
  case rejected(types.EVENTS.SAVE):
    return showToast('Event could not be saved', Intent.DANGER)
  case fulfilled(types.EVENTS.DELETE):
    return showToast('Event deleted')
  case rejected(types.EVENTS.DELETE):
    return showToast('Event could not be deleted')
  case fulfilled(types.EVENTS.DELETE_MANY):
    return showToast(`${action.payload.length} event${action.payload.length > 1 ? 's' : ''} deleted`)
  case rejected(types.EVENTS.DELETE_MANY):
    return showToast('Some events could not be deleted', Intent.DANGER)

  // Users
  case fulfilled(types.USERS.SAVE):
    return showToast('User saved')
  case rejected(types.USERS.SAVE):
    return showToast('User could not be saved', Intent.DANGER)

  // Invites
  case fulfilled(types.INVITES.SAVE):
    return showToast('Invite saved')
  case fulfilled(types.INVITES.CREATE):
    return showToast('Invite sent')
  // Videos
  case fulfilled(types.VIDEOS.CREATE):
  case fulfilled(types.VIDEOS.SAVE):
    return showToast('Video saved')
  case rejected(types.VIDEOS.CREATE):
  case rejected(types.VIDEOS.SAVE):
    return showToast('Video could not be saved', Intent.DANGER)
  case fulfilled(types.VIDEOS.DELETE_MANY):
    return showToast(`${action.payload.length} tag${action.payload.length > 1 ? 's' : ''} deleted`)
  case rejected(types.VIDEOS.DELETE_MANY):
    return showToast('Some videos could not be deleted', Intent.DANGER)

  default:
    return toaster

  }
}
