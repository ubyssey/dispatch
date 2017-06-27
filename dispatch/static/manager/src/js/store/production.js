import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { useRouterHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux'
import { createHistory } from 'history'
import { loadingBarReducer, loadingBarMiddleware } from 'react-redux-loading-bar'
import promiseMiddleware from 'redux-promise-middleware'

import appReducer from '../reducers/AppReducer'
import modalReducer from '../reducers/ModalReducer'

const BASE_PATH = '/admin'

const browserHistory = useRouterHistory(createHistory)({ basename: BASE_PATH })
const router = routerMiddleware(browserHistory)

export const store = createStore(
  combineReducers({
    app: appReducer,
    routing: routerReducer,
    loadingBar: loadingBarReducer,
    modal: modalReducer
  }),
  applyMiddleware(
    thunk,
    router,
    promiseMiddleware(),
    loadingBarMiddleware({
      promiseTypeSuffixes: ['PENDING', 'FULFILLED', 'REJECTED'],
    })
  )
)


export const history = syncHistoryWithStore(browserHistory, store)
