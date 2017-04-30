import moment from 'moment'

export function humanizeDatetime(timestamp) {
  return moment(timestamp).format('lll') // April 18, 2017 12:50 PM
}

export function pending(actionType) { return `${actionType}_PENDING` }
export function fulfilled(actionType) { return `${actionType}_FULFILLED` }
export function rejected(actionType) { return `${actionType}_REJECTED` }
