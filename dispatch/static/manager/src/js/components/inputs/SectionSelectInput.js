import React from 'react'
import { connect } from 'react-redux'

import ItemSelectInput from './ItemSelectInput'

import sectionsActions from '../../actions/SectionsActions'

class SectionSelectInputComponent extends React.Component {

  listSections(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.listSections(this.props.token, queryObj)
  }

  getCurrentFilter(selected) {
    if (this.props.entities.sections[selected]) {
      return this.props.entities.sections[selected].name
    }

    return 'Filter by Section'
  }

  getEditMessage(isFilter, selected) {
    if (isFilter) {
      return this.getCurrentFilter(selected)
    }

    if (selected) {
      return 'Edit Section'
    }

    return 'Add Section'
  }

  render() {

    return (
      <ItemSelectInput
        many={false}
        selected={this.props.selected}
        inline={this.props.inline}
        showSortableList={this.props.showSortableList}
        results={this.props.sections.ids}
        entities={this.props.entities.sections}
        onChange={(selected) => this.props.update(selected)}
        fetchResults={(query) => this.listSections(query)}
        attribute='name'
        editMessage={this.getEditMessage(this.props.isFilter, this.props.selected)} />
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
