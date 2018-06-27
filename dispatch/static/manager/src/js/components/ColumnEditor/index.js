import React from 'react'
import { connect } from 'react-redux'

import columnsActions from '../../actions/ColumnsActions'
import ColumnForm from './ColumnForm'

import ItemEditor from '../ItemEditor'

const TYPE = 'Column'
const AFTER_DELETE = 'columns'

const mapStateToProps = (state) => {
  return {
    listItem: state.app.columns.single,
    entities: {
      remote: state.app.entities.columns,
      local: state.app.entities.local.columns,
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getListItem: (token, columnId) => {
      dispatch(columnsActions.get(token, columnId))
    },
    setListItem: (column) => {
      dispatch(columnsActions.set(column))
    },
    saveListItem: (token, columnId, data) => {
      dispatch(columnsActions.save(token, columnId, data))
    },
    createListItem: (token, data) => {
      dispatch(columnsActions.create(token, data, AFTER_DELETE))
    },
    deleteListItem: (token, columnId, next) => {
      dispatch(columnsActions.delete(token, columnId, next))
    }
  }
}

function ColumnEditorComponent(props) {
  return (
    <ItemEditor
      type={TYPE}
      afterDelete={AFTER_DELETE}
      form={ColumnForm}
      {... props} />
  )
}

const ColumnEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(ColumnEditorComponent)

export default ColumnEditor
