import React from 'react'
import { connect } from 'react-redux'

import ItemSelectInput from './ItemSelectInput'

import columnsActions from '../../../actions/ColumnsActions'

class ColumnSelectInputComponent extends React.Component {

  listColumns(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.listColumns(this.props.token, queryObj)
  }

  render() {
    return (
      <ItemSelectInput
        many={this.props.many}
        selected={this.props.selected}
        showSortableList={true}
        results={this.props.columns.ids}
        entities={this.props.entities.columns}
        onChange={(selected) => this.props.update(selected)}
        fetchResults={(query) => this.listColumns(query)}
        attribute='name'
        editMessage={this.props.selected ? 'Edit column' : 'Add column'} />
    )
  }

}

const mapStateToProps = (state) => {
  return {
    columns: state.app.columns.list,
    entities: {
      columns: state.app.entities.columns
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listColumns: (token, query) => {
      dispatch(columnsActions.list(token, query))
    }
  }
}

const ColumnSelectInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(ColumnSelectInputComponent)

export default ColumnSelectInput
