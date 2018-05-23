import React from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'

import ItemIndexPage from '../ItemIndexPage'
import issuesActions from '../../actions/IssuesActions'

const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token,
    listItems: state.app.issues.list,
    entities: {
      listItems: state.app.entities.issues
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listListItems: (token, query) => {
      dispatch(issuesActions.list(token, query))
    },
    toggleListItem: (issueId) => {
      dispatch(issuesActions.toggle(issueId))
    },
    toggleAllListItems: (issueIds) => {
      dispatch(issuesActions.toggleAll(issueIds))
    },
    clearSelectedListItems: () => {
      dispatch(issuesActions.clearSelected())
    },
    clearListItems: () => {
      dispatch(issuesActions.clearAll())
    },
    deleteListItems: (token, issueIds, goDownPage) => {
      dispatch(issuesActions.deleteMany(token, issueIds))
      if (goDownPage) {
        dispatch(replace({
          pathname: '/issues/',
          query: {
            page: goDownPage
          }
        }))
      }
    },
    searchListItems: (query) => {
      dispatch(issuesActions.search(query))
    }
  }
}


function IssuesPageComponent(props) {
  return (
    <ItemIndexPage
      typeSingular='issue'
      typePlural='issues'
      displayColumn='title'
      pageTitle='Issues'
      headers={[ 'Name' ]}
      {... props} />
  )
}

const IssuesPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(IssuesPageComponent)

export default IssuesPage
