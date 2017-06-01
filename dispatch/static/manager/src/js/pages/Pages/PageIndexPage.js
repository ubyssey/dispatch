import React from 'react'
import { connect } from 'react-redux'

import ItemIndexPage from '../ItemIndexPage'
import pagesActions from '../../actions/PagesActions'
import { humanizeDatetime } from '../../util/helpers'

const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token,
    listItems: state.app.pages.list,
    entities: {
      listItems: state.app.entities.pages
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listListItems: (token, query) => {
      dispatch(pagesActions.list(token, query))
    },
    toggleListItem: (pageId) => {
      dispatch(pagesActions.toggle(pageId))
    },
    toggleAllListItems: (pageIds) => {
      dispatch(pagesActions.toggleAll(pageIds))
    },
    clearSelectedListItems: () => {
      dispatch(pagesActions.clearSelected())
    },
    clearListItems: () => {
      dispatch(pagesActions.clearAll())
    },
    deleteListItems: (token, pageIds) => {
      dispatch(pagesActions.deleteMany(token, pageIds))
    },
    searchListItems: (token, section, query) => {
      dispatch(pagesActions.search(section, query))
    }
  }
}

function PagesPageComponent(props) {
  return (
    <ItemIndexPage
      typePlural='pages'
      typeSingular='page'
      displayColumn='title'
      headers={[ 'Title', 'Published', 'Revisions' ]}
      extraColumns={[
        item => item.published_at ? humanizeDatetime(item.published_at) : 'Unpublished',
        item => item.latest_version + ' revisions'
      ]}
      {...props} />
  )
}

const PagesPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(PagesPageComponent)

export default PagesPage
