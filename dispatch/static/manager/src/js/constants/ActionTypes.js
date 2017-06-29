import { actionTypes, resourceActionTypes } from '../util/redux'

// Resource actions
export const SECTIONS = resourceActionTypes('SECTIONS', ['LIST_NAV'])
export const ARTICLES = resourceActionTypes('ARTICLES', ['PUBLISH', 'UNPUBLISH'])
export const PAGES = resourceActionTypes('PAGES', ['PUBLISH', 'UNPUBLISH'])
export const FILES = resourceActionTypes('FILES')
export const IMAGES = resourceActionTypes('IMAGES')
export const PERSONS = resourceActionTypes('PERSONS')
export const TOPICS = resourceActionTypes('TOPICS')
export const TAGS = resourceActionTypes('TAGS')
export const TEMPLATES = resourceActionTypes('TEMPLATES')
export const GALLERIES = resourceActionTypes('GALLERIES')
export const EVENTS = resourceActionTypes('EVENTS', ['COUNT_PENDING'])

// Authentication actions
export const AUTH = actionTypes('AUTH', [
  'LOGIN_REQUIRED',
  'GET_TOKEN'
])

// Integration actions
export const INTEGRATIONS = actionTypes('INTEGRATIONS', [
  'CALLBACK',
  'UPDATE',
  'SAVE',
  'GET',
  'DELETE'
])

export const MODAL = actionTypes('MODAL', [
  'OPEN',
  'CLOSE'
])

// Dashboard actions
export const DASHBOARD = actionTypes('DASHBOARD', [
  'LIST_ACTIONS',
  'LIST_RECENT_ARTICLES'
])

// Zones actions
export const ZONES = actionTypes('ZONES', [
  'LIST',
  'GET',
  'SAVE',
  'LIST_WIDGETS',
  'SET'
])

// Toaster actions
export const SETUP_TOASTER = 'SETUP_TOASTER'

// Editor actions
export const UPDATE_EDITOR = 'UPDATE_EDITOR'
export const TOGGLE_EDITOR_STYLE = 'TOGGLE_EDITOR_STYLE'
export const EDITOR_KEY_COMMAND = 'EDITOR_KEY_COMMAND'
export const EDITOR_INSERT_LINK = 'EDITOR_INSERT_LINK'
export const EDITOR_REMOVE_LINK = 'EDITOR_REMOVE_LINK'
