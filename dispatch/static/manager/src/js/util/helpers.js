import moment from 'moment'

export function humanizeDatetime(timestamp) {
  return moment(timestamp).format('lll') // April 18, 2017 12:50 PM
}

export function dateObjToAPIString(date) {
  if (date instanceof Date) {
    return date.toISOString()
  }
  return date
}
