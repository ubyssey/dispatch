import * as types from '../constants/ActionTypes'
import DispatchAPI from '../api/dispatch'

export function fetchSections() {
  return {
    type: types.FETCH_SECTIONS,
    payload: DispatchAPI.sections.fetchSections().then(json => json.results)
  }
}
