import React from 'react'
import { connect } from 'react-redux'
import R from 'ramda'

import ItemSelectInput from './ItemSelectInput'

import personsActions from '../../../actions/PersonsActions'

const AUTHOR_TYPES = [
  ['Author', 'author'],
  ['Illustrator', 'illustrator'],
  ['Photographer', 'photographer'],
  ['Videographer', 'videographer'],
]

class AuthorSelectInputComponent extends React.Component {

  listPersons(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.listPersons(this.props.token, queryObj)
  }

  update(value, extraFields) {
    // Merge person IDs with their corresponding author type
    const authors = value.map(id => ({
      person: id,
      type: extraFields[id] || this.props.defaultAuthorType
    }))

    this.props.update(authors)
  }

  render() {
    let value = []
    let extraFields = []
    
    if(this.props.value){
      value = this.props.value.map(author => author.person)
      extraFields = this.props.value
      .reduce((fields, author) => R.assoc(author.person, author.type, fields), {})
    }

    return (
      <ItemSelectInput
        value={value}
        extraFields={extraFields}
        many={this.props.many}
        inline={this.props.inline}
        showSortableList={this.props.showSortableList}
        results={this.props.persons.ids}
        entities={this.props.entities.persons}
        onChange={(value, extraFields) => this.update(value, extraFields)}
        fetchResults={(query) => this.listPersons(query)}
        extraFieldOptions={AUTHOR_TYPES}
        attribute='full_name'
        errors={this.props.authorErrors} 
        editMessage={this.props.value && this.props.value.length ? 'Edit authors' : 'Add authors'} />
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

// Author types
AuthorSelectInput.AUTHOR = 'author'
AuthorSelectInput.PHOTOGRAPHER = 'photographer'
AuthorSelectInput.VIDEOGRAPHER = 'videographer'
AuthorSelectInput.ILLUSTRATOR = 'illustrator'

AuthorSelectInput.defaultProps = {
  defaultAuthorType: AuthorSelectInput.AUTHOR
}

export default AuthorSelectInput