import React from 'react'
import { connect } from 'react-redux'

import FilterSelectInput from './FilterSelectInput'

import personsActions from '../../../actions/PersonsActions'

class AuthorFilterInputComponent extends React.Component {

  listPersons(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.listPersons(this.props.token, queryObj)
  }

  render() {
    return (
      <FilterSelectInput
        selected={this.props.selected}
        filterBy='authors'
        results={this.props.persons}
        entities={this.props.entities.persons}
        update={(selected) => this.props.update(selected)}
        fetchResults={(query) => this.listPersons(query)}
        attribute='full_name'
        editMessage={this.props.selected ? this.props.entities['persons'][this.props.selected].full_name : 'Filter by Author'}
        />
    )
  }

}

const mapStateToProps = (state) => {
  return {
    persons: state.app.persons.list,
    entities: {
      persons: state.app.entities.persons
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listPersons: (token, query) => {
      dispatch(personsActions.list(token, query))
    }
  }
}

const AuthorSelectInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthorFilterInputComponent)

export default AuthorSelectInput
