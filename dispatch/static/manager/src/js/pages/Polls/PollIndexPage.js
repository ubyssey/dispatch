import React from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'

import ItemIndexPage from '../ItemIndexPage'
import pollsActions from '../../actions/PollsActions'

const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token,
    listItems: state.app.polls.list,
    entities: {
      listItems: state.app.entities.polls
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listListItems: (token, query) => {
      dispatch(pollsActions.list(token, query))
    },
    toggleListItem: (pollId) => {
      dispatch(pollsActions.toggle(pollId))
    },
    toggleAllListItems: (pollIds) => {
      dispatch(pollsActions.toggleAll(pollIds))
    },
    clearSelectedListItems: () => {
      dispatch(pollsActions.clearSelected())
    },
    clearListItems: () => {
      dispatch(pollsActions.clearAll())
    },
    deleteListItems: (token, pollIds, goDownPage) => {
      dispatch(pollsActions.deleteMany(token, pollIds))
      if (goDownPage) {
        dispatch(replace({
          pathname: '/polls/',
          query: {
            page: goDownPage
          }
        }))
      }
    },
    searchListItems: (query) => {
      dispatch(pollsActions.search(query))
    }
  }
}

function PollsPageComponent(props) {
  return (
    <ItemIndexPage
      typeSingular='poll'
      typePlural='polls'
      displayColumn='question'
      pageTitle='Polls'
      headers={[ 'Question', 'Votes' ]}
      extraColumns={[
        item => item.total_votes
      ]}
      {... props} />
  )
}

const PollsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(PollsPageComponent)

export default PollsPage
