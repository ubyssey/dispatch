import React from 'react'
import { connect } from 'react-redux'

import personsActions from '../../actions/PersonsActions'
import PersonForm from './PersonForm'

import ItemEditor from '../ItemEditor'

const TYPE = 'Person'
const AFTER_DELETE = 'persons'

const mapStateToProps = (state) => {
  return {
    listItem: state.app.persons.single,
    entities: {
      remote: state.app.entities.persons,
      local: state.app.entities.local.persons,
    },
    token: state.app.auth.token
  }
}

function makeFormData(data) {
  let formData = new FormData()

  formData.append('full_name', data.full_name || '')
  formData.append('slug', data.slug || '')
  formData.append('description', data.description || '')
  formData.append('image', data.image, data.image ? data.image.name : null)

  return formData
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
      dispatch(personsActions.save(token, personId, makeFormData(data)))
    },
    createListItem: (token, data) => {
      dispatch(personsActions.create(token, makeFormData(data), AFTER_DELETE))
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
