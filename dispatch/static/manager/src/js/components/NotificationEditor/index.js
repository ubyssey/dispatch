import React from 'react'
import { connect } from 'react-redux'

import notificationsActions from '../../actions/NotificationsActions'
import NotificationForm from './NotificationForm'
import NewNotificationForm from './NewNotificationForm'
import ItemEditor from '../ItemEditor'

const TYPE = 'Notification'
const AFTER_DELETE = 'notifications'

const mapStateToProps = (state) => {
  return {
    listItem: state.app.notifications.single,
    entities: {
      remote: state.app.entities.notifications,
      local: state.app.entities.local.notifications,
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getListItem: (token, notificationId) => {
      dispatch(notificationsActions.get(token, notificationId))
    },
    setListItem: (notification) => {
      dispatch(notificationsActions.set(notification))
    },
    saveListItem: (token, notificationId, data) => {
      dispatch(notificationsActions.save(token, notificationId, data))
    },
    createListItem: (token, data) => {
      dispatch(notificationsActions.create(token, data, AFTER_DELETE))
    },
    deleteListItem: (token, notificationId, next) => {
      dispatch(notificationsActions.delete(token, notificationId, next))
    }
  }
}

function NotificationEditorComponent(props) {

  let form = NotificationForm

  if (props.isNew) {
    form = NewNotificationForm
  }
  return (
    <div className='c-notification-editor--container'>
      <ItemEditor
        showOverflow={true}
        isNew={props.isNew}
        type={TYPE}
        afterDelete={AFTER_DELETE}
        displayField='title'
        form={form}
        {... props} />
    </div>
  )
}

const NotificationEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationEditorComponent)

export default NotificationEditor
