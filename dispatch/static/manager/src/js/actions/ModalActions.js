import * as types from '../constants/ActionTypes'

export function openModal(component, props) {
  return {
    type: types.OPEN_MODAL,
    component: component,
    props: props
  }
}

export function closeModal() {
  return {
    type: types.CLOSE_MODAL
  }
}
