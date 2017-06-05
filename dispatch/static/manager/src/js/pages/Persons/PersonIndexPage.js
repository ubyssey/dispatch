import React from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'

import ItemIndexPage from '../ItemIndexPage'
import personsActions from '../../actions/PersonsActions'

const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token,
    listItems: state.app.persons.list,
    entities: {
      listItems: state.app.entities.persons
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listListItems: (token, query) => {
      dispatch(personsActions.list(token, query))
    },
    toggleListItem: (personId) => {
      dispatch(personsActions.toggle(personId))
    },
    toggleAllListItems: (personIds) => {
      dispatch(personsActions.toggleAll(personIds))
    },
    clearSelectedListItems: () => {
      dispatch(personsActions.clearSelected())
    },
    clearListItems: () => {
      dispatch(personsActions.clearAll())
    },
    deleteListItems: (token, personIds, goDownPage) => {
      dispatch(personsActions.deleteMany(token, personIds))
      if (goDownPage) {
        dispatch(replace({
          pathname: '/persons/',
          query: {
            page: goDownPage
          }
        }))
      }
    },
    searchListItems: (query) => {
      dispatch(personsActions.search(query))
    }
  }
}

function PersonsPageComponent(props) {
  return (
    <ItemIndexPage
      typeSingular='person'
      typePlural='persons'
      displayColumn='full_name'
      pageTitle='Persons'
      headers={[ 'Full Name', 'Slug' ]}
      extraColumns={[
        item => item.slug
      ]}
      {... props} />
  )
}

const PersonsPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonsPageComponent)

export default PersonsPage
