import moment from 'moment'

export function humanizeDatetime(timestamp) {
  return moment(timestamp).format('lll') // April 18, 2017 12:50 PM
}

export function dateObjToAPIString(date) {
  const DJANGO_DATETIME_INPUT_FORMAT = 'YYYY-MM-DD HH:mm:00'
  date = moment(date)
  return date.format(DJANGO_DATETIME_INPUT_FORMAT)
}
