import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { useRouterHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux'
import { createHistory } from 'history'
import { loadingBarReducer, loadingBarMiddleware } from 'react-redux-loading-bar'
import promiseMiddleware from 'redux-promise-middleware'

import { createLogger } from 'redux-logger'

import appReducer from '../reducers/AppReducer'
import modalReducer from '../reducers/ModalReducer'

const BASE_PATH = '/admin'

const loggerOptions = {
  collapsed: true,
  level: 'info'
}

const browserHistory = useRouterHistory(createHistory)({ basename: BASE_PATH })
const router = routerMiddleware(browserHistory)

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(
  combineReducers({
    app: appReducer,
    routing: routerReducer,
    loadingBar: loadingBarReducer,
    modal: modalReducer
  }),
  composeEnhancers(
    applyMiddleware(
      thunk,
      router,
      createLogger(loggerOptions),
      promiseMiddleware(),
      loadingBarMiddleware({
        promiseTypeSuffixes: ['PENDING', 'FULFILLED', 'REJECTED'],
      })
    )
  )
)

export const history = syncHistoryWithStore(browserHistory, store)
