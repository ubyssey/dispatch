import { createStore, combineReducers, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import { useRouterHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux'
import { createHistory } from 'history'
import { loadingBarReducer, loadingBarMiddleware } from 'react-redux-loading-bar'
import promiseMiddleware from 'redux-promise-middleware'

import appReducer from './reducers/AppReducer'
import modalReducer from './reducers/ModalReducer'

const BASE_PATH = '/admin'

const browserHistory = useRouterHistory(createHistory)({ basename: BASE_PATH })
const router = routerMiddleware(browserHistory)

let middleware = [
  thunk,
  router,
  promiseMiddleware(),
  loadingBarMiddleware({
    promiseTypeSuffixes: ['PENDING', 'FULFILLED', 'REJECTED'],
  })
]

let composeEnhancers = compose

if (process.env.NODE_ENV == 'development') {
  composeEnhancers =  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  const loggerOptions = {
    collapsed: true,
    level: 'info'
  }
  const logger = require('redux-logger').createLogger(loggerOptions)
  middleware = [...middleware, logger]
}

export const store = createStore(
  combineReducers({
    app: appReducer,
    routing: routerReducer,
    loadingBar: loadingBarReducer,
    modal: modalReducer
  }),
  composeEnhancers(applyMiddleware(...middleware))
)

export const history = syncHistoryWithStore(browserHistory, store)
