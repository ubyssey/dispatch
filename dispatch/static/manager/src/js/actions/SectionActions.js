import * as types from '../constants/ActionTypes'
import DispatchAPI from '../api/dispatch'

function requestSections() {
  return {
    type: types.SECTIONS_REQUEST
  }
}

function receiveSections(sections) {
  return {
    type: types.SECTIONS_RECEIVE,
    sections: sections
  }
}

export function fetchSections() {
  return function (dispatch) {
    dispatch(requestSections())

    return DispatchAPI.sections.fetchSections()
      .then( json => dispatch(receiveSections(json.results)) )
  }
}
