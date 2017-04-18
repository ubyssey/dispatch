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

var DispatchAPI = {
  fetchPage: (token, uri) => {
    return getPageRequest(uri, token)
  },
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
    fetchSections: (token, query) => {
      return getRequest('sections', null, query, token)
    }
  },
  articles: {
    fetchArticles: (token, query) => {
      return getRequest('articles', null, query, token)
    },
    fetchArticle: (token, articleId, params) => {
      return getRequest('articles', articleId, params, token)
    },
    saveArticle: (token, articleId, data) => {
      return patchRequest('articles', articleId, data, token)
    },
    createArticle: (token, data) => {
      return postRequest('articles', null, data, token)
    },
    deleteArticle: (token, articleId) => {
      return deleteRequest('articles', articleId, null, token)
    },
    publishArticle: (token, articleId) => {
      return postRequest('articles.publish', articleId, null, token)
    },
    unpublishArticle: (token, articleId) => {
      return postRequest('articles.unpublish', articleId, null, token)
    }
  },
  files:{
    fetchFiles: (token, query) => {
      return getRequest('files', null, query, token)
    },
    createFile: (token, data) => {
      return postMultipartRequest('files', null, data, token)
    },
    deleteFile: (token, fileId) => {
      return deleteRequest('files', fileId, null, token)
    }
  },
  images: {
    fetchImages: (token, query) => {
      return getRequest('images', null, query, token)
    },
    saveImage: (token, imageId, data) => {
      return patchRequest('images', imageId, data, token)
    },
    createImage: (token, data) => {
      return postMultipartRequest('images', null, data, token)
    },
    deleteImage: (token, imageId) => {
      return deleteRequest('images', imageId, null, token)
    }
  },
  templates: {
    fetchTemplate: (token, templateId) => {
      return getRequest('templates', templateId, null, token)
    },
    fetchTemplates: (token, query) => {
      return getRequest('templates', null, query, token)
    }
  },
  persons: {
    fetchPersons: (token, query) => {
      return getRequest('people', null, query, token)
    },
    createPerson: (token, fullName) => {
      return postRequest('people', null, {full_name: fullName}, token)
    }
  },
  topics: {
    fetchTopics: (token, query) => {
      return getRequest('topics', null, query, token)
    },
    createTopic: (token, name) => {
      return postRequest('topics', null, {name: name}, token)
    }
  },
  tags: {
    fetchTags: (token, query) => {
      return getRequest('tags', null, query, token)
    },
    createTag: (token, name) => {
      return postRequest('tags', null, {name: name}, token)
    }
  },
  integrations: {
    fetchIntegration: (token, integrationId) => {
      return getRequest('integrations', integrationId, null, token)
    },
    saveIntegration: (token, integrationId, data) => {
      return patchRequest('integrations', integrationId, data, token)
    },
    deleteIntegration: (token, integrationId) => {
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
