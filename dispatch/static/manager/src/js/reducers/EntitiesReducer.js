import R from 'ramda'

import { Reducer } from '../util/redux'

function containsEntities(action) {
  return R.path(['payload', 'data', 'entities'], action)
}

const initialState = {
  articles: {},
  article: {},
  sections: {},
  section: {},
  files: {},
  images: {},
  image: {},
  templates: {},
  persons: {},
  topics: {},
  tags: {}
}

let reducer = new Reducer(initialState)

reducer.handleDefault((state, action) => {

  if (!containsEntities(action)) {
    return state
  }

  return R.mergeWith(
    R.merge,
    state,
    action.payload.data.entities
  )
})

export default reducer.reduce
