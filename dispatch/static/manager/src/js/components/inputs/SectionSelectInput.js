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
        editMessage={this.props.isFilter ? (this.props.selected ? this.props.entities.sections[this.props.selected].name : 'Filter by Section') : (this.props.selected ? 'Edit section' : 'Add section') } />
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
