import React from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'

import ItemIndexPage from '../ItemIndexPage'
import galleriesActions from '../../actions/GalleriesActions'

const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token,
    listItems: state.app.galleries.list,
    entities: {
      listItems: state.app.entities.galleries
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listListItems: (token, query) => {
      dispatch(galleriesActions.list(token, query))
    },
    toggleListItem: (galleryId) => {
      dispatch(galleriesActions.toggle(galleryId))
    },
    toggleAllListItems: (galleryIds) => {
      dispatch(galleriesActions.toggleAll(galleryIds))
    },
    clearSelectedListItems: () => {
      dispatch(galleriesActions.clearSelected())
    },
    clearListItems: () => {
      dispatch(galleriesActions.clearAll())
    },
    deleteListItems: (token, galleryIds, goDownPage) => {
      dispatch(galleriesActions.deleteMany(token, galleryIds))
      if (goDownPage) {
        dispatch(replace({
          pathname: '/galleries/',
          query: {
            page: goDownPage
          }
        }))
      }
    },
    searchListItems: (query) => {
      dispatch(galleriesActions.search(query))
    }
  }
}


function TagsPageComponent(props) {
  return (
    <ItemIndexPage
      typeSingular='gallery'
      typePlural='galleries'
      displayColumn='title'
      {... props} />
  )
}

const TagsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(TagsPageComponent)

export default TagsPage
