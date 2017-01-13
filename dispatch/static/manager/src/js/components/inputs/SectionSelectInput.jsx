import React from 'react'
import { connect } from 'react-redux'

import MultiSelectInput from './MultiSelectInput.jsx'

import * as sectionsActions from '../../actions/SectionsActions'

class SectionSelectInputComponent extends React.Component {

  constructor(props) {
    super(props)

    this.addSection = this.addSection.bind(this)
    this.removeSection = this.removeSection.bind(this)
    this.fetchSections = this.fetchSections.bind(this)
  }

  addSection(sectionId) {
    this.props.update(sectionId)
  }

  removeSection() {
    this.props.update(null)
  }

  fetchSections(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.fetchSections(this.props.token, queryObj)
  }

  render() {
    return (
      <MultiSelectInput
        selected={this.props.selected ? [this.props.selected] : []}
        results={this.props.sections.data}
        entities={this.props.entities.sections}
        addValue={this.addSection}
        removeValue={this.removeSection}
        fetchResults={this.fetchSections}
        attribute='name'
        editMessage={this.props.selected ? 'Edit section' : 'Add section'} />
    )
  }

}

const mapStateToProps = (state) => {
  return {
    sections: state.app.sections,
    entities: {
      sections: state.app.entities.sections
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSections: (token, query) => {
      dispatch(sectionsActions.fetchSections(token, query))
    }
  }
}

const SectionSelectInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(SectionSelectInputComponent)

export default SectionSelectInput
