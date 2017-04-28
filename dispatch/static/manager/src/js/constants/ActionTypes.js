import R from 'ramda'

const DEFAULT_RESOURCE_ACTION_TYPES = [
  'LIST',
  'GET',
  'SAVE',
  'CREATE',
  'DELETE',
  'DELETE_MANY',
  'PUBLISH',
  'UNPUBLISH',
  'SET',
  'TOGGLE',
  'TOGGLE_ALL',
  'CLEAR_SELECTED',
  'CLEAR_ALL'
]

/**
 * Utility to generate an action type object from a list of action types.
 */
function makeActionTypes(prefix, actionTypes) {
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
function resourceActionTypes(prefix, extraActionTypes=[]) {
  return makeActionTypes(
    prefix,
    R.concat(DEFAULT_RESOURCE_ACTION_TYPES, extraActionTypes)
  )
}

// Resource actions
export const SECTIONS = resourceActionTypes('SECTIONS')
export const ARTICLES = resourceActionTypes('ARTICLES', ['PUBLISH', 'UNPUBLISH'])
export const PAGES = resourceActionTypes('PAGES', ['PUBLISH', 'UNPUBLISH'])
export const FILES = resourceActionTypes('FILES')
export const IMAGES = resourceActionTypes('IMAGES')
export const PERSONS = resourceActionTypes('PERSONS')
export const TOPICS = resourceActionTypes('TOPICS')
export const TAGS = resourceActionTypes('TAGS')
export const TEMPLATES = resourceActionTypes('TEMPLATES')

console.log(ARTICLES)

// User actions
export const AUTH_REQUIRED = 'AUTH_REQUIRED'
export const AUTH_REQUEST_TOKEN = 'AUTH_REQUEST_TOKEN'
export const AUTH_RECEIVE_TOKEN = 'AUTH_RECEIVE_TOKEN'
export const AUTH_FAILURE_TOKEN = 'AUTH_FAILURE_TOKEN'

// Modal actions
export const OPEN_MODAL = 'OPEN_MODAL'
export const CLOSE_MODAL = 'CLOSE_MODAL'

// Toaster actions
export const SETUP_TOASTER = 'SETUP_TOASTER'

// Editor actions
export const UPDATE_EDITOR = 'UPDATE_EDITOR'
export const TOGGLE_EDITOR_STYLE = 'TOGGLE_EDITOR_STYLE'
export const EDITOR_KEY_COMMAND = 'EDITOR_KEY_COMMAND'
export const EDITOR_INSERT_LINK = 'EDITOR_INSERT_LINK'
export const EDITOR_REMOVE_LINK = 'EDITOR_REMOVE_LINK'

// Integration actions
export const INTEGRATION_CALLBACK = 'INTEGRATION_CALLBACK'
export const UPDATE_INTEGRATION = 'UPDATE_INTEGRATION'
export const SAVE_INTEGRATION = 'SAVE_INTEGRATION'
export const FETCH_INTEGRATION = 'FETCH_INTEGRATION'
export const DELETE_INTEGRATION = 'DELETE_INTEGRATION'

// Dashboard actions
export const FETCH_ACTIONS = 'FETCH_ACTIONS'
export const FETCH_RECENT_ARTICLES = 'FETCH_RECENT_ARTICLES'
