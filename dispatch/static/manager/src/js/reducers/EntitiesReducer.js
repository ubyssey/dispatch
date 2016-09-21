import * as types from '../constants/ActionTypes'

const initialState = {
  articles: {},
  article: {},
  sections: {}
}

export default function entitiesReducer(state = initialState, action) {
  switch (action.type) {

    // Articles
    case types.FETCH_ARTICLES + '_PENDING':
      return Object.assign({}, state, {
        articles: {}
      })
    case types.FETCH_ARTICLES + '_FULFILLED':
      return Object.assign({}, state, {
        articles: Object.assign({}, state.articles, action.payload.results.entities.articles)
      })

    // Article
    case types.FETCH_ARTICLE + '_PENDING':
      return Object.assign({}, state, {
        article: {}
      })
    case types.FETCH_ARTICLE  + '_FULFILLED':
      return Object.assign({}, state, {
        articles: Object.assign({}, state.articles, action.payload.entities.articles),
        article: action.payload.entities.articles
      })

    // Sections
    case types.FETCH_SECTIONS + '_FULFILLED':
      return Object.assign({}, state, {
        sections: Object.assign({}, state.sections, action.payload.entities.sections)
      })
    default:
      return state
  }
}
