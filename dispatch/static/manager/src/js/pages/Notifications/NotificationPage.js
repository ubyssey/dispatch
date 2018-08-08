import React from 'react'

import NotificationEditor from '../../components/NotificationEditor'

export default function NotificationPage(props) {
  return (
    <NotificationEditor
      itemId={props.params.notificationId}
      goBack={props.router.goBack}
      route={props.route} />
  )
}
