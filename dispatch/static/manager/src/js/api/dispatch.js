import fetch from 'isomorphic-fetch';

const API_URL = 'http://localhost:8000/api/';

const ROUTES = {
  'auth/token': ['POST'],

  // Sections
  'sections': ['GET']
}

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
}

function isValidRoute(route, method) {
  return ROUTES.hasOwnProperty(route)
}

function buildRoute(route, method) {
  if ( isValidRoute(route, method) ) {
    return API_URL + route
  } else {
    // TODO: Raise exception
  }
}

function getRequest(route) {
  return fetch(
    buildRoute(route, 'GET'),
    {
      method: 'GET',
      headers: DEFAULT_HEADERS
    }
  )
}

function postRequest(route, payload) {
  return fetch(
    buildRoute(route, 'POST'),
    {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(payload)
    }
  )
}

var DispatchAPI = {
  auth: {
    fetchToken: (email, password) => {

      var payload = {
        email: email,
        password: password
      }

      return postRequest('auth/token', payload)
    }
  },
  sections: {
    fetchSections: () => {
      return getRequest('sections')
    }
  }
}

export default DispatchAPI;
