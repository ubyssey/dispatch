import React from 'react'
import { connect } from 'react-redux'

import FilterSelectInput from './FilterSelectInput'

import sectionsActions from '../../../actions/SectionsActions'

class SectionFilterInputComponent extends React.Component {

  listSections(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.listSections(this.props.token, queryObj)
  }

  convertValue(tags) {
    return typeof tags === 'undefined' ? tags : (typeof tags === 'object' ? tags.map(Number) : Number(tags))
  }

  render() {
    return (
      <FilterSelectInput
        value={this.convertValue(this.props.value)}
        results={this.props.sections}
        entities={this.props.entities.sections}
        update={(value) => this.props.update(value)}
        fetchResults={(query) => this.listSections(query)}
        attribute='name'
        icon='projects'
        label='Section'
        editMessage='Filter by section' />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    sections: state.app.sections.list,
    entities: {
      sections: state.app.entities.sections
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listSections: (token, query) => {
      dispatch(sectionsActions.list(token, query))
    }
  }
}

const SectionFilterInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(SectionFilterInputComponent)

export default SectionFilterInput
