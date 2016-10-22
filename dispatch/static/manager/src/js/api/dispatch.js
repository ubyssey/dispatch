import fetch from 'isomorphic-fetch'
import url from 'url'

const API_URL = 'http://localhost:8000/api/'

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
}

function buildRoute(route, id) {
  let fullRoute = API_URL + route

  if (id) {
    fullRoute += `/${id}`
  }

  // Append slash to all urls
  let lastCharacter = fullRoute.slice(-1)

  if (lastCharacter !== '/') {
    fullRoute += '/'
  }

  return fullRoute
}

function buildHeaders(token) {
  let headers = DEFAULT_HEADERS
  if (token) {
    headers['Authorization'] = `Token ${token}`
  }
  return headers
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

function getRequest(route, id=null, query={}, token=null) {
  let urlString = buildRoute(route, id) + url.format({query: query})
  return fetch(
    urlString,
    {
      method: 'GET',
      headers: buildHeaders(token)
    }
  )
  .then(handleError)
  .then(parseJSON)
}

function postRequest(route, id=null, payload={}, token=null) {
  return fetch(
    buildRoute(route, id),
    {
      method: 'POST',
      headers: buildHeaders(token),
      body: JSON.stringify(payload)
    }
  )
  .then(handleError)
  .then(parseJSON)
}

function patchRequest(route, id=null, payload={}, token=null) {
  return fetch(
    buildRoute(route, id),
    {
      method: 'PATCH',
      headers: buildHeaders(token),
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
    fetchArticles: (query) => {
      return getRequest('articles', null, query)
    },
    fetchArticle: (articleId) => {
      return getRequest('articles', articleId)
    },
    deleteArticles: (token, articleIds) => {
      return postRequest('articles/delete', null, {ids: articleIds.join(',')}, token)
    }
  },
  images: {
    fetchImages: (query) => {
      return getRequest('images', null, query)
    },
    updateImage: (token, imageId, data) => {
      return patchRequest('images', imageId, data, token)
    }
  },
  persons: {
    fetchPersons: (token) => {
      return getRequest('people', null, null, token)
    }
  }
}

export default DispatchAPI;
