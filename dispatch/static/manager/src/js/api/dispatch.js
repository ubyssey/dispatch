import fetch from 'isomorphic-fetch';

const API_URL = 'http://localhost:8000/api/';

const ROUTES = {
  'auth/token': ['POST']
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

function postRequest(route, payload) {
  return fetch(
    buildRoute(route, 'POST'),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
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
  }
}

export default DispatchAPI;
