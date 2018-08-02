import R from 'ramda'

import { Reducer } from '../util/redux'

function containsEntities(action) {
  return R.path(['payload', 'data', 'entities'], action)
}

function mergeEntities(state, entities) {
  return R.mergeWith(
    R.merge,
    state,
    entities
  )
}

const initialState = {
  articles: {},
  sections: {},
  subsections: {},
  files: {},
  images: {},
  templates: {},
  persons: {},
  topics: {},
  tags: {},
  galleries: {},
  zones: {},
  widgets: {},
  events: {},
  local: {
    articles: {},
    subsections: {},
    images: {},
    sections: {},
    galleries: {},
    zones: {}
  }
}

let reducer = new Reducer(initialState)

reducer.handleDefault((state, action) => {

  if (!containsEntities(action)) {
    return state
  }

  if (action.isLocalAction) {
    return R.merge(
      state,
      {
        local: mergeEntities(state.local, action.payload.data.entities)
      }
    )
  } else {
    return R.merge(
      mergeEntities(state, action.payload.data.entities),
      {
        local: mergeEntities(state.local, action.payload.data.entities)
      }
    )
  }

})

export default reducer.getReducer()
