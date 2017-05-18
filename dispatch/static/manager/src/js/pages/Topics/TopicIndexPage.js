import React from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'

import ItemIndexPage from '../ItemIndexPage'
import topicsActions from '../../actions/TopicsActions'

const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token,
    listItems: state.app.topics.list,
    entities: {
      listItems: state.app.entities.topics
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listListItems: (token, query) => {
      dispatch(topicsActions.list(token, query))
    },
    toggleListItem: (topicId) => {
      dispatch(topicsActions.toggle(topicId))
    },
    toggleAllListItems: (topicIds) => {
      dispatch(topicsActions.toggleAll(topicIds))
    },
    clearSelectedListItems: () => {
      dispatch(topicsActions.clearSelected())
    },
    clearListItems: () => {
      dispatch(topicsActions.clearAll())
    },
    deleteListItems: (token, topicIds, goDownPage) => {
      dispatch(topicsActions.deleteMany(token, topicIds))
      if (goDownPage) {
        dispatch(replace({
          pathname: '/topics/',
          query: {
            page: goDownPage
          }
        }))
      }
    },
    searchListItems: (query) => {
      dispatch(topicsActions.search(query))
    }
  }
}

function TopicsPageComponent(props) {
  return (
    <ItemIndexPage
      typeSingular='topic'
      typePlural='topics'
      {... props} />
  )
}

const TopicsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(TopicsPageComponent)

export default TopicsPage
