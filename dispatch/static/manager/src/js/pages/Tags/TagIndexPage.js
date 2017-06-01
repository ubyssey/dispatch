import React from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'

import ItemIndexPage from '../ItemIndexPage'
import tagsActions from '../../actions/TagsActions'

const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token,
    listItems: state.app.tags.list,
    entities: {
      listItems: state.app.entities.tags
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listListItems: (token, query) => {
      dispatch(tagsActions.list(token, query))
    },
    toggleListItem: (tagId) => {
      dispatch(tagsActions.toggle(tagId))
    },
    toggleAllListItems: (tagIds) => {
      dispatch(tagsActions.toggleAll(tagIds))
    },
    clearSelectedListItems: () => {
      dispatch(tagsActions.clearSelected())
    },
    clearListItems: () => {
      dispatch(tagsActions.clearAll())
    },
    deleteListItems: (token, tagIds, goDownPage) => {
      dispatch(tagsActions.deleteMany(token, tagIds))
      if (goDownPage) {
        dispatch(replace({
          pathname: '/tags/',
          query: {
            page: goDownPage
          }
        }))
      }
    },
    searchListItems: (query) => {
      dispatch(tagsActions.search(query))
    }
  }
}


function TagsPageComponent(props) {
  return (
    <ItemIndexPage
      typeSingular='tag'
      typePlural='tags'
      displayColumn='name'
      headers={[ 'Name' ]}
      {... props} />
  )
}

const TagsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(TagsPageComponent)

export default TagsPage
