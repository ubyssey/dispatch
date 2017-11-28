import React from 'react'

import { connect } from 'react-redux'

import ItemSelectInput from './ItemSelectInput'

import sectionsActions from '../../actions/SectionsActions'
import personsActions from '../../actions/PersonsActions'

class FilterSelectInputComponent extends React.Component {

  listItems(query, listAction) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }
    listAction(this.props.token, queryObj)
  }

  fetchResults(query) {
    if (this.props.filterBy === 'sections') {
      this.listItems(query, this.props.listSections)
    }
    else if (this.props.filterBy === 'authors') {
      this.listItems(query, this.props.listAuthors)
    }
  }

  getEditMessage(filterBy, selected) {
    if (filterBy === 'sections'){
      if (this.props.entities.sections[selected]) {
        return this.props.entities.sections[selected].name
      }

      return 'Filter by Section'
    }
    else if (filterBy === 'authors') {
      if (this.props.entities.authors[selected]) {
        return this.props.entities.authors[selected].full_name
      }

      return 'Filter by Author'
    }
  }

  getEntityAttribute(filterBy) {
    if (filterBy === 'authors') {
      return 'full_name'
    }
    else if (filterBy === 'sections') {
      return 'name'
    }
  }


  render() {
    return (
      <ItemSelectInput
        many={false}
        selected={this.props.selected}
        inline={false}
        showSortableList={false}
        results={this.props[this.props.filterBy].ids}
        entities={this.props.entities[this.props.filterBy]}
        onChange={(selected) => this.props.update(selected)}
        fetchResults={(query) => this.fetchResults(query)}
        attribute={this.getEntityAttribute(this.props.filterBy)}
        editMessage={this.getEditMessage(this.props.filterBy, this.props.selected)} />
    )
  }

}

const mapStateToProps = (state) => {
  return {
    sections: state.app.sections.list,
    authors: state.app.persons.list,
    entities: {
      sections: state.app.entities.sections,
      authors: state.app.entities.persons
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listSections: (token, query) => {
      dispatch(sectionsActions.list(token, query))
    },
    listAuthors: (token, query) => {
      dispatch(personsActions.list(token, query))
    }
  }
}

const FilterSelectInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterSelectInputComponent)


export default FilterSelectInput
