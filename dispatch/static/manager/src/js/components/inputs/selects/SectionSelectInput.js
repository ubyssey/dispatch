import React from 'react'
import { connect } from 'react-redux'

import ItemSelectInput from './ItemSelectInput'

import sectionsActions from '../../../actions/SectionsActions'

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
        value={this.props.value}
        inline={this.props.inline}
        showSortableList={this.props.showSortableList}
        results={this.props.sections.ids}
        entities={this.props.entities.sections}
        onChange={(value) => this.props.update(value)}
        fetchResults={(query) => this.listSections(query)}
        attribute='name'
        editMessage={this.props.value ? 'Edit section' : 'Add section'} />
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
