import React from 'react'
import { connect } from 'react-redux'

import personsActions from '../../actions/PersonsActions'
import PersonForm from './PersonForm'

import ItemEditor from '../ItemEditor'

const TYPE = 'Person'
const TYPE_PLURAL = 'People'
const AFTER_DELETE = 'persons'

const mapStateToProps = (state) => {
  return {
    listItem: state.app.persons.single,
    entities: {
      remote: state.app.entities.persons,
      local: state.app.entities.local.persons,
    },
    token: state.app.auth.token,
    settings: state.app.settings
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getListItem: (token, personId) => {
      dispatch(personsActions.get(token, personId))
    },
    setListItem: (person) => {
      dispatch(personsActions.set(person))
    },
    saveListItem: (token, personId, data) => {
      dispatch(personsActions.save(token, personId, data))
    },
    createListItem: (token, data) => {
      dispatch(personsActions.create(token, data, AFTER_DELETE))
    },
    deleteListItem: (token, personId, next) => {
      dispatch(personsActions.delete(token, personId, next))
    }
  }
}

function PersonEditorComponent(props) {
  return (
    <ItemEditor
      type={TYPE}
      typePlural={TYPE_PLURAL}
      afterDelete={AFTER_DELETE}
      form={PersonForm}
      displayField='full_name'
      {... props} />
  )
}

const PersonEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonEditorComponent)

export default PersonEditor
