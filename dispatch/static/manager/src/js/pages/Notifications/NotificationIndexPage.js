import React from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'
import { humanizeDatetime } from '../../util/helpers'

import ItemIndexPage from '../ItemIndexPage'
import notificationsActions from '../../actions/NotificationsActions'


const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token,
    listItems: state.app.notifications.list,
    entities: {
      listItems: state.app.entities.notifications
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listListItems: (token, query) => {
      dispatch(notificationsActions.list(token, query))
    },
    toggleListItem: (notificationId) => {
      dispatch(notificationsActions.toggle(notificationId))
    },
    toggleAllListItems: (notificationIds) => {
      dispatch(notificationsActions.toggleAll(notificationIds))
    },
    clearSelectedListItems: () => {
      dispatch(notificationsActions.clearSelected())
    },
    clearListItems: () => {
      dispatch(notificationsActions.clearAll())
    },
    deleteListItems: (token, notificationIds, goDownPage) => {
      dispatch(notificationsActions.deleteMany(token, notificationIds))
      if (goDownPage) {
        dispatch(replace({
          pathname: '/notifications/',
          query: {
            page: goDownPage
          }
        }))
      }
    },
    searchListItems: (query) => {
      dispatch(notificationsActions.search(query))
    }
  }
}

function NotificationsPageComponent(props) {
  return (
    <ItemIndexPage
      typeSingular='notification'
      typePlural='notifications'
      displayColumn='article_headline'
      pageTitle='Notifications'
      headers={['Headline', 'Push time']}
      extraColumns={[
        item => humanizeDatetime(item.scheduled_push_time, true)
      ]}
      {... props} />
  )
}

const NotificationsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationsPageComponent)

export default NotificationsPage
