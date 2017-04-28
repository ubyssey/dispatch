export function pending(actionType) {
  return `${actionType}_PENDING`
}

export function fulfilled(actionType) {
  return `${actionType}_FULFILLED`
}

export function rejected(actionType) {
  return `${actionType}_REJECTED`
}
