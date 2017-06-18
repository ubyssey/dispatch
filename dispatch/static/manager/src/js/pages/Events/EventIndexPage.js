import React from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'

import PendingTag from '../../components/EventEditor/PendingTag'
import ItemIndexPage from '../ItemIndexPage'
import eventsActions from '../../actions/EventsActions'

const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token,
    listItems: state.app.events.list,
    entities: {
      listItems: state.app.entities.events
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listListItems: (token, query) => {
      dispatch(eventsActions.list(token, query))
    },
    toggleListItem: (eventId) => {
      dispatch(eventsActions.toggle(eventId))
    },
    toggleAllListItems: (eventIds) => {
      dispatch(eventsActions.toggleAll(eventIds))
    },
    clearSelectedListItems: () => {
      dispatch(eventsActions.clearSelected())
    },
    clearListItems: () => {
      dispatch(eventsActions.clearAll())
    },
    deleteListItems: (token, eventIds, goDownPage) => {
      dispatch(eventsActions.deleteMany(token, eventIds))
      if (goDownPage) {
        dispatch(replace({
          pathname: '/events/',
          query: {
            page: goDownPage
          }
        }))
      }
    },
    searchListItems: (query) => {
      dispatch(eventsActions.search(query))
    }
  }
}

function EventsPageComponent(props) {
  return (
    <ItemIndexPage
      typeSingular='event'
      typePlural='events'
      displayColumn='title'
      toolbarContent={<PendingTag />}
      {... props} />
  )
}

const EventsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(EventsPageComponent)

export default EventsPage
