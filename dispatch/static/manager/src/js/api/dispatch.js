import fetch from 'isomorphic-fetch'
import url from 'url'

const API_URL = 'http://localhost:8000/api/'

const ROUTES = {
  'auth/token': ['POST'],

  // Sections
  'sections': ['GET'],

  // Articles
  'articles': ['GET'],
}

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
}

function isValidRoute(route, method) {
  return ROUTES.hasOwnProperty(route)
}

function buildRoute(route, method, id) {
  if ( isValidRoute(route, method) ) {
    let fullRoute = API_URL + route
    if (id) {
      fullRoute += `/${id}`
    }
    return fullRoute
  } else {
    // TODO: Raise exception
  }
}

function handleError(response) {
  if (!response.ok) {
      throw Error(response.statusText)
  }
  return response
}

function parseJSON(response) {
  return response.json()
}

function getRequest(route, id=null, query={}) {
  let urlString = buildRoute(route, 'GET', id) + url.format({query: query})
  return fetch(
    urlString,
    {
      method: 'GET',
      headers: DEFAULT_HEADERS
    }
  )
  .then(handleError)
  .then(parseJSON)
}

function postRequest(route, id=null, payload={}) {
  return fetch(
    buildRoute(route, 'POST', id),
    {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(payload)
    }
  )
  .then(handleError)
  .then(parseJSON)
}

var DispatchAPI = {
  auth: {
    fetchToken: (email, password) => {

      var payload = {
        email: email,
        password: password
      }

      return postRequest('auth/token', null, payload)
    }
  },
  sections: {
    fetchSections: () => {
      return getRequest('sections')
    }
  },
  articles: {
    fetchArticles: ({section: section}) => {
      return getRequest('articles', null, {section: section})
    },
    fetchArticle: (articleId) => {
      return getRequest('articles', articleId)
    }
  }
}

export default DispatchAPI;
