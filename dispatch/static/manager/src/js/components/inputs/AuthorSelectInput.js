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

  getCurrentFilter(selected) {
    if (this.props.entities.persons[selected]) {
      return this.props.entities.persons[selected].full_name
    }

    return 'Filter by Author'
  }

  getEditMessage(isFilter, selected) {
    if (isFilter) {
      return this.getCurrentFilter(selected)
    }

    if (selected) {
      return 'Edit Authors'
    }

    return 'Add Authors'
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
        editMessage={this.getEditMessage(this.props.isFilter, this.props.selected) } />
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
