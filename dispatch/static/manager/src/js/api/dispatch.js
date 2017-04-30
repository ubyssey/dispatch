import fetch from 'isomorphic-fetch'
import url from 'url'

const API_URL = 'http://localhost:8000/api/'

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
}

function buildRoute(route, id) {
  let pieces = route.split('.')

  let fullRoute = API_URL + pieces[0]

  if (id) {
    fullRoute += `/${id}/`
  }

  if (pieces.length > 1) {
    fullRoute += pieces[1]
  }

  // Append slash to all urls
  let lastCharacter = fullRoute.slice(-1)

  if (lastCharacter !== '/') {
    fullRoute += '/'
  }

  return fullRoute
}

function buildHeaders(token, useDefaultHeaders=true) {
  let headers = {}
  if (useDefaultHeaders) {
    headers = DEFAULT_HEADERS
  }
  if (token) {
    headers['Authorization'] = `Token ${token}`
  }
  return headers
}

function handleError(response) {
  return response.ok ? response : Promise.reject(response.statusText)
}

function parseJSON(response) {
  return response.json()
    .then(json => response.ok ? json : Promise.reject(json))
}

function getRequest(route, id=null, query={}, token=null) {
  let urlString = buildRoute(route, id) + url.format({ query: query })
  return fetch(
    urlString,
    {
      method: 'GET',
      headers: buildHeaders(token)
    }
  )
  .then(parseJSON)
}

function getPageRequest(uri, token=null) {
  return fetch(
    uri,
    {
      method: 'GET',
      headers: buildHeaders(token)
    }
  )
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
  .then(parseJSON)
}

function postMultipartRequest(route, id=null, payload={}, token=null) {
  return fetch(
    buildRoute(route, id),
    {
      method: 'POST',
      headers: buildHeaders(token, false),
      body: payload
    }
  )
  .then(handleError)
  .then(parseJSON)
}

function deleteRequest(route, id=null, payload={}, token=null) {
  return fetch(
    buildRoute(route, id),
    {
      method: 'DELETE',
      headers: buildHeaders(token),
      body: JSON.stringify(payload)
    }
  )
  .then(handleError)
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
  .then(parseJSON)
}

const DispatchAPI = {
  fetchPage: (token, uri) => {
    return getPageRequest(uri, token)
  },
  auth: {
    getToken: (email, password) => {

      const payload = {
        email: email,
        password: password
      }

      return postRequest('auth/token', null, payload)
    }
  },
  sections: {
    list: (token, query) => {
      return getRequest('sections', null, query, token)
    },
    get: (token, sectionId) => {
      return getRequest('sections', sectionId, null, token)
    },
    save: (token, sectionId, data) => {
      return patchRequest('sections', sectionId, data, token)
    },
    create: (token, data) => {
      return postRequest('sections', null, data, token)
    },
    delete: (token, sectionId) => {
      return deleteRequest('sections', sectionId, null, token)
    },
  },
  articles: {
    list: (token, query) => {
      return getRequest('articles', null, query, token)
    },
    get: (token, articleId, params) => {
      return getRequest('articles', articleId, params, token)
    },
    save: (token, articleId, data) => {
      return patchRequest('articles', articleId, data, token)
    },
    create: (token, data) => {
      return postRequest('articles', null, data, token)
    },
    delete: (token, articleId) => {
      return deleteRequest('articles', articleId, null, token)
    },
    publish: (token, articleId) => {
      return postRequest('articles.publish', articleId, null, token)
    },
    unpublish: (token, articleId) => {
      return postRequest('articles.unpublish', articleId, null, token)
    }
  },
  pages: {
    list: (token, query) => {
      return getRequest('pages', null, query, token)
    },
    get: (token, pageId, params) => {
      return getRequest('pages', pageId, params, token)
    },
    save: (token, pageId, data) => {
      return patchRequest('pages', pageId, data, token)
    },
    create: (token, data) => {
      return postRequest('pages', null, data, token)
    },
    delete: (token, pageId) => {
      return deleteRequest('pages', pageId, null, token)
    },
    publish: (token, pageId) => {
      return postRequest('pages.publish', pageId, null, token)
    },
    unpublish: (token, pageId) => {
      return postRequest('pages.unpublish', pageId, null, token)
    }
  },
  files: {
    list: (token, query) => {
      return getRequest('files', null, query, token)
    },
    create: (token, data) => {
      return postMultipartRequest('files', null, data, token)
    },
    delete: (token, fileId) => {
      return deleteRequest('files', fileId, null, token)
    }
  },
  images: {
    list: (token, query) => {
      return getRequest('images', null, query, token)
    },
    save: (token, imageId, data) => {
      return patchRequest('images', imageId, data, token)
    },
    create: (token, data) => {
      return postMultipartRequest('images', null, data, token)
    },
    delete: (token, imageId) => {
      return deleteRequest('images', imageId, null, token)
    }
  },
  templates: {
    list: (token, query) => {
      return getRequest('templates', null, query, token)
    },
    get: (token, templateId) => {
      return getRequest('templates', templateId, null, token)
    }
  },
  persons: {
    list: (token, query) => {
      return getRequest('people', null, query, token)
    },
    create: (token, fullName) => {
      return postRequest('people', null, {full_name: fullName}, token)
    }
  },
  topics: {
    list: (token, query) => {
      return getRequest('topics', null, query, token)
    },
    create: (token, name) => {
      return postRequest('topics', null, {name: name}, token)
    }
  },
  tags: {
    list: (token, query) => {
      return getRequest('tags', null, query, token)
    },
    create: (token, name) => {
      return postRequest('tags', null, {name: name}, token)
    }
  },
  integrations: {
    get: (token, integrationId) => {
      return getRequest('integrations', integrationId, null, token)
    },
    save: (token, integrationId, data) => {
      return patchRequest('integrations', integrationId, data, token)
    },
    delete: (token, integrationId) => {
      return deleteRequest('integrations', integrationId, null, token)
    },
    callback: (token, integrationId, query) => {
      return getRequest('integrations.callback', integrationId, query, token)
    }
  },
  dashboard: {
    actions: (token) => {
      return getRequest('dashboard/actions', null, {}, token)
    },
    recent: (token) => {
      return getRequest('dashboard/recent', null, {}, token)
    }
  }
}

export default DispatchAPI
