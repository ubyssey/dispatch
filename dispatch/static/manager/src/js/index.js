import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore,  combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux'
import { createHistory } from 'history';

import * as Pages from './pages';
import * as Containers from './containers';
import appReducer from './reducers/AppReducer'

const BASE_PATH = '/admin';

const browserHistory = useRouterHistory(createHistory)({ basename: BASE_PATH })
const router = routerMiddleware(browserHistory)

const store = createStore(
  combineReducers({
    app: appReducer,
    routing: routerReducer
  }),
  applyMiddleware(thunk, router)
)

const history = syncHistoryWithStore(browserHistory, store)

render((
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={Containers.App}>

        <Route component={Containers.Main}>
          <IndexRoute component={Pages.Dashboard} />
          <Route path="/articles" component={Pages.Articles} />
          <Route path="/articles/:articleId" component={Pages.Article} />
        </Route>

        <Route component={Containers.Basic}>
          <Route path='/login' component={Pages.Login} />
        </Route>

      </Route>
    </Router>
  </Provider>
), document.getElementById('container'))
