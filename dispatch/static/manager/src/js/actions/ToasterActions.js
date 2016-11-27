import * as types from '../constants/ActionTypes'

export function setupToaster(toaster) {
  return {
    type: types.SETUP_TOASTER,
    toaster: toaster
  }
}
