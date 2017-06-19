import moment from 'moment'

export function humanizeDatetime(timestamp) {
  return moment(timestamp).format('lll') // April 18, 2017 12:50 PM
}

export function confirmNavigation(router, route, shouldConfirm) {
  router.setRouteLeaveHook(
    route,
    () => shouldConfirm() ? 'Unsaved changes. Are you sure you want to leave?' : null
  )
}
