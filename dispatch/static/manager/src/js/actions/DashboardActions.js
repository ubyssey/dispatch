import * as types from '../constants/ActionTypes'
import DispatchAPI from '../api/dispatch'

export function getUserActions(token) {
  return {
    type: types.FETCH_ACTIONS,
    payload: DispatchAPI.dashboard.actions(token)
      .then(json => {
        console.log(json);
        return json
      })
  }
}
