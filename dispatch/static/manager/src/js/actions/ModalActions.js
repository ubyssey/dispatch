import * as types from '../constants/ActionTypes'

export function openModal(component, props) {
  return {
    type: types.OPEN_MODAL,
    component: component,
    props: props
  }
}

export function closeModal(modal) {
  return {
    type: types.CLOSE_MODAL
  }
}
