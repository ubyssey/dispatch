import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'

import MultiSelectInput from './MultiSelectInput'

import personsActions from '../../actions/PersonsActions'

class AuthorSelectInputComponent extends React.Component {

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

  listPersons(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.listPersons(this.props.token, queryObj)
  }

  render() {
    return (
      <MultiSelectInput
        selected={this.props.selected}
        results={this.props.persons.ids}
        entities={this.props.entities.persons}
        addValue={(id) => this.addAuthor(id)}
        removeValue={(id) => this.removeAuthor(id)}
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
