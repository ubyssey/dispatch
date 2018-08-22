import React from 'react'
import { connect } from 'react-redux'

import subsectionsActions from '../../actions/SubsectionsActions'
import SubsectionForm from './SubsectionForm'

import ItemEditor from '../ItemEditor'

const TYPE = 'Subsection'
const TYPE_PLURAL = 'Subsections'
const AFTER_DELETE = 'subsections'

const mapStateToProps = (state) => {
  return {
    listItem: state.app.subsections.single,
    entities: {
      remote: state.app.entities.subsections,
      local: state.app.entities.local.subsections,
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getListItem: (token, subsectionId) => {
      dispatch(subsectionsActions.get(token, subsectionId))
    },
    setListItem: (subsection) => {
      dispatch(subsectionsActions.set(subsection))
    },
    saveListItem: (token, subsectionId, data) => {
      dispatch(subsectionsActions.save(token, subsectionId, data))
    },
    createListItem: (token, data) => {
      dispatch(subsectionsActions.create(token, data, AFTER_DELETE))
    },
    deleteListItem: (token, subsectionId, next) => {
      dispatch(subsectionsActions.delete(token, subsectionId, next))
    }
  }
}

function SubsectionEditorComponent(props) {
  return (
    <ItemEditor
      type={TYPE}
      typePlural={TYPE_PLURAL}
      afterDelete={AFTER_DELETE}
      form={SubsectionForm}
      displayField='name'
      {... props} />
  )
}

const SubsectionEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(SubsectionEditorComponent)

export default SubsectionEditor
