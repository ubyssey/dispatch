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
        many={this.props.many}
        selected={this.props.selected}
        inline={this.props.inline}
        showSortableList={this.props.showSortableList}
        results={this.props.persons.ids}
        entities={this.props.entities.persons}
        onChange={(selected) => this.props.update(selected)}
        fetchResults={(query) => this.listPersons(query)}
        attribute='full_name'
        editMessage={this.props.isFilter ? (this.props.selected ? this.props.entities.persons[this.props.selected].full_name : 'Filter by Author') : (this.props.selected ? 'Edit authors' : 'Add authors') } />
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
