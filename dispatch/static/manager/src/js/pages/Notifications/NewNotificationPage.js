import React from 'react'

import NotificationEditor from '../../components/NotificationEditor'

export default function NewNotificationPage(props) {
  return (
    <NotificationEditor
      className='o-notification--article--select'
      isNew={true}
      goBack={props.router.goBack}
      route={props.route} />
  )
}