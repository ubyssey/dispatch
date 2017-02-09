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
    deleteArticles: (token, articleIds) => {
      return postRequest('articles/delete', null, {ids: articleIds.join(',')}, token)
    }
  },
  images: {
    fetchImages: (query) => {
      return getRequest('images', null, query)
    },
    saveImage: (token, imageId, data) => {
      return patchRequest('images', imageId, data, token)
    },

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
  }
}

export default DispatchAPI;
