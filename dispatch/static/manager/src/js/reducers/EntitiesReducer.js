import * as types from '../constants/ActionTypes'

const initialState = {
  articles: {}
}

export default function entitiesReducer(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_ARTICLES + '_FULFILLED':
    case types.FETCH_ARTICLE  + '_FULFILLED':
      return Object.assign({}, state, {
        articles: Object.assign({}, state.articles, action.payload.entities.articles)
      })
    default:
      return state
  }
}
