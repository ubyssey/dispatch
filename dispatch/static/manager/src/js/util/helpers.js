import moment from 'moment'
import R from 'ramda'

export function humanizeDatetime(timestamp) {
  if (!timestamp) {
    return null
  }

  return moment(timestamp).format('lll') // April 18, 2017 12:50 PM
}

export function confirmNavigation(router, route, shouldConfirm) {
  router.setRouteLeaveHook(
    route,
    () => shouldConfirm() ? 'Unsaved changes. Are you sure you want to leave?' : null
  )
}

export function dateObjToAPIString(date) {
  let ret
  if (date instanceof Date) {
    ret = date.toISOString()
  } else {
    const time_ms = Date.parse(date)
    if(!isNaN(time_ms)) {
      ret - new Date(time_ms).toISOString()
    } else {
      ret = ''
    }
  }
  return ret
}

export function getPath(location, page) {
  let query = R.clone(location.query)

  query.page = page

  return {
    pathname: location.pathname,
    query: query
  }
}
