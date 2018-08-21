import React from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'

import ItemIndexPage from '../ItemIndexPage'
import podcastsActions from '../../actions/PodcastsActions'

const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token,
    listItems: state.app.podcasts.list,
    entities: {
      listItems: state.app.entities.podcasts
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listListItems: (token, query) => {
      dispatch(podcastsActions.list(token, query))
    },
    toggleListItem: (podcastId) => {
      dispatch(podcastsActions.toggle(podcastId))
    },
    toggleAllListItems: (podcastIds) => {
      dispatch(podcastsActions.toggleAll(podcastIds))
    },
    clearSelectedListItems: () => {
      dispatch(podcastsActions.clearSelected())
    },
    clearListItems: () => {
      dispatch(podcastsActions.clearAll())
    },
    deleteListItems: (token, podcastIds, goDownPage) => {
      dispatch(podcastsActions.deleteMany(token, podcastIds))
      if (goDownPage) {
        dispatch(replace({
          pathname: '/podcasts/',
          query: {
            page: goDownPage
          }
        }))
      }
    },
    searchListItems: (query) => {
      dispatch(podcastsActions.search(query))
    }
  }
}

function PodcastsPageComponent(props) {
  return (
    <ItemIndexPage
      typeSingular='podcast'
      typePlural='podcasts'
      displayColumn='title'
      pageTitle='Podcasts'
      headers={[ 'Title', 'URL' ]}
      extraColumns={[
        item => item.url
      ]}
      {... props} />
  )
}

const PodcastsIndexPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(PodcastsPageComponent)

export default PodcastsIndexPage
