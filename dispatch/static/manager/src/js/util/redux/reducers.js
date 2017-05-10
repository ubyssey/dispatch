import R from 'ramda'

import { pending, fulfilled, rejected } from './actions'

export class Reducer {

  constructor(initialState) {
    this.initialState = initialState

    this.handlers = new Map()
    this.defaultHandler = (state) => state
  }

  handle(type, handler) {
    this.handlers.set(type, handler)
  }

  handleDefault(handler) {
    this.defaultHandler = handler
  }

  reduce(state, action) {
    if (this.handlers.has(action.type)) {
      return this.handlers.get(action.type)(state || this.initialState, action)
    } else {
      return this.defaultHandler(state || this.initialState, action)
    }
  }

  getReducer() {
    return this.reduce.bind(this)
  }

}

export function buildManyResourceReducer(types) {

  const initialState = {
    isLoading: false,
    isLoaded: false,
    selected: [],
    isAllSelected: false,
    count: null,
    ids: []
  }

  let reducer = new Reducer(initialState)

  reducer.handle(pending(types.LIST), (state) => R.merge(state, { isLoading: true }))

  reducer.handle(fulfilled(types.LIST), (state, action) => {
    return R.merge(state, {
      isLoading: false,
      isLoaded: true,
      count: action.payload.count,
      ids: action.payload.data.result
    })
  })

  reducer.handle(fulfilled(types.DELETE_MANY), (state, action) => {
    return R.merge(state, {
      ids: R.without(action.payload, state.ids)
    })
  })

  reducer.handle(types.TOGGLE_SELECTED, (state, action) => {
    const index = R.findIndex(R.equals(action.id), state.selected)
    return R.merge(state, {
      selected: index > -1 ? R.remove(index, 1, state.selected) : R.append(action.id, state.selected)
    })
  })

  reducer.handle(types.TOGGLE_ALL, (state, action) => {
    return R.merge(state, {
      selected: state.isAllSelected ? [] : action.ids,
      isAllSelected: !state.isAllSelected
    })
  })

  reducer.handle(types.CLEAR_SELECTED, (state) => {
    return R.merge(state, {
      selected: [],
      isAllSelected: false
    })
  })

  return reducer

}

export function handleSuccess(state, action) {
  return R.merge(state, {
    isLoading: false,
    isLoaded: true,
    errors: {},
    id: action.payload.data.result
  })
}

export function handleError(state, action) {
  return R.merge(state, {
    errors: action.payload
  })
}

export function buildSingleResourceReducer(types) {

  const initialState = {
    isLoading: false,
    isLoaded: false,
    errors: {},
    id: null
  }

  let reducer = new Reducer(initialState)

  reducer.handle(pending(types.GET), (state) => R.merge(state, { isLoading: true }))

  reducer.handle(fulfilled(types.GET), handleSuccess)
  reducer.handle(fulfilled(types.SAVE), handleSuccess)

  reducer.handle(rejected(types.SAVE), handleError)
  reducer.handle(rejected(types.CREATE), handleError)

  reducer.handle(types.SET, (state, action) => {
    return R.merge(state, {
      isLoading: false,
      isLoaded: true,
      id: action.payload.data.result
    })
  })

  reducer.handle(types.SELECT, (state, action) => {
    return R.merge(state, {
      id: action.id
    })
  })

  return reducer

}
