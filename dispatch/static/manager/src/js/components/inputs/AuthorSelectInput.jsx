import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'

import MultiSelectInput from './MultiSelectInput.jsx'

import * as personsActions from '../../actions/PersonsActions'

class AuthorSelectInputComponent extends React.Component {

  constructor(props) {
    super(props)

    this.addAuthor = this.addAuthor.bind(this)
    this.removeAuthor = this.removeAuthor.bind(this)
    this.createAuthor = this.createAuthor.bind(this)
    this.fetchPersons = this.fetchPersons.bind(this)
  }

  addAuthor(authorId) {
    let newAuthors = R.append(authorId, this.props.selected)
    this.props.update(newAuthors)
  }

  removeAuthor(authorId) {
    let newAuthors = R.remove(
      R.findIndex(R.equals(authorId), this.props.selected),
      1,
      this.props.selected
    )
    this.props.update(newAuthors)
  }

  createAuthor(fullName) {

  }

  fetchPersons(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.fetchPersons(this.props.token, queryObj)
  }

  render() {
    return (
      <MultiSelectInput
        selected={this.props.selected}
        results={this.props.persons.data}
        entities={this.props.entities.persons}
        addValue={this.addAuthor}
        removeValue={this.removeAuthor}
        createValue={this.createAuthor}
        fetchResults={this.fetchPersons}
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
    fetchPersons: (token, query) => {
      dispatch(personsActions.fetchPersons(token, query))
    }
  }
}

const AuthorSelectInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthorSelectInputComponent)

export default AuthorSelectInput
