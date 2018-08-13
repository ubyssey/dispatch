import React from 'react'
import { connect } from 'react-redux'

import ItemSelectInput from './ItemSelectInput'

import subsectionsActions from '../../../actions/SubsectionsActions'

class SubsectionSelectInputComponent extends React.Component {

  listSubsections(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.listSubsections(this.props.token, queryObj)
  }

  render() {
    return (
      <ItemSelectInput
        many={this.props.many}
        selected={this.props.selected}
        showSortableList={true}
        results={this.props.subsections.ids}
        entities={this.props.entities.subsections}
        onChange={(selected) => this.props.update(selected)}
        fetchResults={(query) => this.listSubsections(query)}
        attribute='name'
        editMessage={this.props.selected ? 'Edit subsection' : 'Add subsection'} />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    subsections: state.app.subsections.list,
    entities: {
      subsections: state.app.entities.subsections
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listSubsections: (token, query) => {
      dispatch(subsectionsActions.list(token, query))
    }
  }
}

const SubsectionSelectInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(SubsectionSelectInputComponent)

export default SubsectionSelectInput
