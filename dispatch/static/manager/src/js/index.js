import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux'
import { createHistory } from 'history'
import { loadingBarReducer, loadingBarMiddleware } from 'react-redux-loading-bar'
import promiseMiddleware from 'redux-promise-middleware'

import * as Pages from './pages'
import * as Containers from './containers'
import appReducer from './reducers/AppReducer'
import modalReducer from './reducers/ModalReducer'

const BASE_PATH = '/admin'

const browserHistory = useRouterHistory(createHistory)({ basename: BASE_PATH })
const router = routerMiddleware(browserHistory)

const store = createStore(
  combineReducers({
    app: appReducer,
    routing: routerReducer,
    loadingBar: loadingBarReducer,
    modal: modalReducer
  }),
  applyMiddleware(thunk, router, promiseMiddleware(), loadingBarMiddleware())
)

const history = syncHistoryWithStore(browserHistory, store)

render((
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={Containers.App}>

        <Route component={Containers.Main}>
          <IndexRoute component={Pages.Dashboard} />

          <Route path="articles">
            <IndexRoute component={Pages.Articles.Index} />
            <Route path="new" component={Pages.Articles.NewArticle} />
            <Route path=":articleId" component={Pages.Articles.Article} />
          </Route>

          <Route path='components' component={Pages.Components} />
          <Route path='files' component={Pages.Files} />
          <Route path='pages' component={Pages.Pages} />
          <Route path='sections' component={Pages.Sections} />
          <Route path='people' component={Pages.People} />
          <Route path='profile' component={Pages.Profile} />

          <Route path='integrations' component={Pages.Integrations.Index}>
            <Route path='fb-instant-articles' component={Pages.Integrations.FBInstantArticles} />
          </Route>

        </Route>

        <Route component={Containers.Basic}>
          <Route path='/login' component={Pages.Login} />
        </Route>

      </Route>
    </Router>
  </Provider>
), document.getElementById('container'))
