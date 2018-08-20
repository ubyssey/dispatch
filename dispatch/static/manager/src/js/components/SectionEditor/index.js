import React from 'react'
import { connect } from 'react-redux'

import sectionsActions from '../../actions/SectionsActions'
import SectionForm from './SectionForm'

import ItemEditor from '../ItemEditor'

const TYPE = 'Section'
const TYPE_PLURAL = 'Sections'
const AFTER_DELETE = 'sections'

const mapStateToProps = (state) => {
  return {
    listItem: state.app.sections.single,
    entities: {
      remote: state.app.entities.sections,
      local: state.app.entities.local.sections,
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getListItem: (token, sectionId) => {
      dispatch(sectionsActions.get(token, sectionId))
    },
    setListItem: (section) => {
      dispatch(sectionsActions.set(section))
    },
    saveListItem: (token, sectionId, data) => {
      dispatch(sectionsActions.save(token, sectionId, data))
    },
    createListItem: (token, data) => {
      dispatch(sectionsActions.create(token, data, AFTER_DELETE))
    },
    deleteListItem: (token, sectionId, next) => {
      dispatch(sectionsActions.delete(token, sectionId, next))
    }
  }
}

function SectionEditorComponent(props) {
  return (
    <ItemEditor
      type={TYPE}
      typePlural={TYPE_PLURAL}
      afterDelete={AFTER_DELETE}
      form={SectionForm}
      {... props} />
  )
}

const SectionEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(SectionEditorComponent)

export default SectionEditor
