import R from 'ramda'
import * as types from '../constants/ActionTypes'

const initialState = {
  articles: {},
  article: {},
  sections: {},
  files: {},
  images: {},
  image: {},
  templates: {},
  persons: {},
  topics: {},
  tags: {}
}

export default function entitiesReducer(state = initialState, action) {
  switch (action.type) {

  // Articles
  case types.FETCH_ARTICLES + '_PENDING':
    return R.merge(state, {
      articles: {}
    })
  case types.FETCH_ARTICLES + '_FULFILLED':
    return R.merge(state, {
      articles: R.merge(state.articles, action.payload.results.entities.articles),
      persons: R.merge(state.persons, action.payload.results.entities.persons),
      images: R.merge(state.images, action.payload.results.entities.images),
      topics: R.merge(state.topics, action.payload.results.entities.topics),
      tags: R.merge(state.tags, action.payload.results.entities.tags),
      templates: R.merge(state.templates, action.payload.results.entities.templates)
    })

  // Article
  case types.FETCH_ARTICLE + '_PENDING':
    return R.merge(state, {
      article: {}
    })
  case types.FETCH_ARTICLE + '_FULFILLED':
  case types.SAVE_ARTICLE + '_FULFILLED':
  case `${types.PUBLISH_ARTICLE}_FULFILLED`:
  case `${types.UNPUBLISH_ARTICLE}_FULFILLED`:
  case types.SET_ARTICLE:
    return R.merge(state, {
      articles: R.merge(state.articles, action.payload.entities.articles),
      article: R.merge(state.article, action.payload.entities.articles),
      persons: R.merge(state.persons, action.payload.entities.persons),
      images: R.merge(state.images, action.payload.entities.images),
      topics: R.merge(state.topics, action.payload.entities.topics),
      tags: R.merge(state.tags, action.payload.entities.tags),
      templates: R.merge(state.templates, action.payload.entities.templates)
    })

  // Sections
  case types.FETCH_SECTIONS + '_FULFILLED':
    return R.merge(state, {
      sections: R.merge(state.sections, action.payload.results.entities.sections)
    })

  // Files
  case types.FETCH_FILES + '_FULFILLED':
    return R.merge(state, {
      files: R.merge(state.files, action.payload.results.entities.files)
    })
  case types.CREATE_FILE + '_FULFILLED': {
    return R.merge(state, {
      files: R.merge(state.files, action.payload.result.entities.files)
    })
  }

  // Images
  case types.FETCH_IMAGES + '_FULFILLED':
    return R.merge(state, {
      images:  R.merge(state.images, action.payload.results.entities.images),
      persons: R.merge(state.persons, action.payload.results.entities.persons)
    })
  case types.SAVE_IMAGE + '_FULFILLED':
    return R.merge(state, {
      images: R.merge(state.images, action.payload.entities.images),
      image: R.merge(state.image, action.payload.entities.images)
    })

  // Image
  case types.SELECT_IMAGE:
    return R.merge(state, {
      image: R.assoc(
        action.imageId,
        state.images[action.imageId], {})
    })
  case types.UPDATE_IMAGE:
    return R.merge(state, {
      image: R.merge(state.image, action.payload.entities.images)
    })

  // Templates
  case types.FETCH_TEMPLATE + '_FULFILLED':
    return R.merge(state, {
      templates: R.merge(state.templates, action.payload.entities.templates)
    })
  case types.FETCH_TEMPLATES + '_FULFILLED':
    return R.merge(state, {
      templates: R.merge(state.templates, action.payload.results.entities.templates)
    })

  // Persons
  case types.FETCH_PERSONS + '_FULFILLED':
    return R.merge(state, {
      persons: R.merge(state.persons, action.payload.results.entities.persons)
    })
  case types.CREATE_PERSON + '_FULFILLED':
    return R.merge(state, {
      persons: R.merge(state.persons, action.payload.entities.persons)
    })

  // Topics
  case types.FETCH_TOPICS + '_FULFILLED':
    return R.merge(state, {
      topics: R.merge(state.topics, action.payload.results.entities.topics)
    })
  case types.CREATE_TOPIC + '_FULFILLED':
    return R.merge(state, {
      topics: R.merge(state.topics, action.payload.entities.topics)
    })

  // Tags
  case types.FETCH_TAGS + '_FULFILLED':
    return R.merge(state, {
      tags: R.merge(state.tags, action.payload.results.entities.tags)
    })
  case types.CREATE_TAG + '_FULFILLED':
    return R.merge(state, {
      tags: R.merge(state.tags, action.payload.entities.tags)
    })

  default:
    return state
  }
}
