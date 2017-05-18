import * as types from '../constants/ActionTypes'

export function openModal(component, props) {
  return {
    type: types.MODAL.OPEN,
    component: component,
    props: props
  }
}

export function closeModal() {
  return {
    type: types.MODAL.CLOSE
  }
}
