import { push } from 'react-router-redux'

export function goTo(route) {
  return (dispatch) => {
    dispatch(push(route))
  }
}
