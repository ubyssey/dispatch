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
        attribute={this.props.attribute}
        editMessage={this.props.editMessage(this.props.entities[this.props.filterBy][this.props.selected], this.props.attribute)} />
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
