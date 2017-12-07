import React from 'react'
import { connect } from 'react-redux'
import R from 'ramda'

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

  update(selected, extraFields) {
    const authors = selected.map(id => ({
      person: id,
      type: extraFields[id]
    }))

    this.props.update(authors)
  }

  render() {
    const selected = this.props.selected
      .map(author => author.person)

    const extraFields = this.props.selected
      .reduce((fields, author) => R.assoc(author.person, author.type, fields), {})

    return (
      <ItemSelectInput
        selected={selected}
        extraFields={extraFields}
        results={this.props.persons.ids}
        entities={this.props.entities.persons}
        onChange={(selected, extraFields) => this.update(selected, extraFields)}
        fetchResults={(query) => this.listPersons(query)}
        extraFieldOptions={['author', 'illustrator', 'photographer', 'videographer']}
        attribute='full_name'
        editMessage={this.props.selected.length ? 'Edit authors' : 'Add authors'} />
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
)(AuthorSelectInputComponent)

export default AuthorSelectInput
