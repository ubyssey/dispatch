import React from 'react'
import { connect } from 'react-redux'

import ItemSelectInput from './ItemSelectInput'

import personsActions from '../../actions/PersonsActions'

class AuthorSelectInputComponent extends React.Component {

  listPersons(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.listPersons(this.props.token, queryObj)
  }

  render() {
    return (
      <ItemSelectInput
        selected={this.props.selected}
        results={this.props.persons.ids}
        entities={this.props.entities.persons}
        onChange={(selected) => this.props.update(selected)}
        fetchResults={(query) => this.listPersons(query)}
        attribute='full_name'
        editMessage={this.props.selected.length ? 'Edit authors' : 'Add authors'} />
    )
  }

}

const mapStateToProps = (state) => {
  return {
    persons: state.app.persons,
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
)(AuthorSelectInputComponent)

export default AuthorSelectInput
