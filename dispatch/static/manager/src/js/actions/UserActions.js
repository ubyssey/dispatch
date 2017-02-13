import { push } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import DispatchAPI from '../api/dispatch'

function authRequired(nextPath) {
  return {
    type: types.AUTH_REQUIRED,
    nextPath: nextPath
  }
}

function requestToken() {
  return {
    type: types.AUTH_REQUEST_TOKEN
  }
}

function receiveToken(token, email) {
  return {
    type: types.AUTH_RECEIVE_TOKEN,
    token: token,
    email: email
  }
}


export function requireLogin(nextPath) {
  return function (dispatch) {
    dispatch(push('/login'))
    dispatch(authRequired(nextPath))
  }
}

export function authenticateUser(email, password, nextPath = '/') {
  return function (dispatch) {
    dispatch(requestToken())

    return DispatchAPI.auth.fetchToken(email, password)
      .then( json => {
        dispatch(receiveToken(json.token, email))
        dispatch(push(nextPath))
      })
      .catch(function(err) {
        console.log('error', err)
      })
  }
}

export function deleteArticles(token, articleIds) {
  return {
    type: types.DELETE_ARTICLES,
    payload: DispatchAPI.articles.deleteArticles(token, articleIds)
      .then( json => json.deleted )
  }
}

export function unauthenticateUser(token) {
  return {
    type: types.AUTH_DELETE_TOKEN,
    payload: DispatchAPI.auth.deleteToken(token)
      .catch((err) => console.log(err))
}
