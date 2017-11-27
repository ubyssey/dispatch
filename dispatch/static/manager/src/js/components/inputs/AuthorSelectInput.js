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
    const selected = this.props.selected
      .map(id => this.props.entities.authors[id])
      .map(author => author.person)

    return (
      <ItemSelectInput
        selected={selected}
        results={this.props.persons.ids}
        entities={this.props.entities.persons}
        onChange={(selected) => this.props.update(selected)}
        fetchResults={(query) => this.listPersons(query)}
        extraFields={['author', 'illustrator', 'photographer']}
        attribute='full_name'
        editMessage={this.props.selected.length ? 'Edit authors' : 'Add authors'} />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    persons: state.app.persons.list,
    entities: {
      authors: state.app.entities.authors,
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
