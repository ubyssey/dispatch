import moment from 'moment'
import R from 'ramda'

export function humanizeDatetime(timestamp) {
  if (!timestamp) {
    return null
  }
  
  return moment(timestamp).format('lll') // April 18, 2017 12:50 PM
}

export function dateObjToAPIString(date) {
  if (date instanceof Date) {
    return date.toISOString()
  }
  return date
}

export function getPath(location, page) {
  let query = R.clone(location.query)

  query.page = page

  return {
    pathname: location.pathname,
    query: query
  }
}
