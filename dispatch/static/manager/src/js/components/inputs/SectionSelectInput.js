import React from 'react'
import { connect } from 'react-redux'

import MultiSelectInput from './MultiSelectInput'

import sectionsActions from '../../actions/SectionsActions'

class SectionSelectInputComponent extends React.Component {

  addSection(sectionId) {
    this.props.update(sectionId)
  }

  removeSection() {
    this.props.update(null)
  }

  listSections(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.listSections(this.props.token, queryObj)
  }

  render() {
    return (
      <MultiSelectInput
        selected={this.props.selected ? [this.props.selected] : []}
        results={this.props.sections.ids}
        entities={this.props.entities.sections}
        addValue={(id) => this.addSection(id)}
        removeValue={(id) => this.removeSection(id)}
        fetchResults={(query) => this.listSections(query)}
        attribute='name'
        editMessage={this.props.selected ? 'Edit section' : 'Add section'} />
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

const SectionSelectInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(SectionSelectInputComponent)

export default SectionSelectInput
