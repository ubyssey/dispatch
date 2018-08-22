import React from 'react'
import { connect } from 'react-redux'

import tagsActions from '../../actions/TagsActions'
import TagForm from './TagForm'

import ItemEditor from '../ItemEditor'

const TYPE = 'Tag'
const TYPE_PLURAL = 'Tags'
const AFTER_DELETE = 'tags'

const mapStateToProps = (state) => {
  return {
    listItem: state.app.tags.single,
    entities: {
      remote: state.app.entities.tags,
      local: state.app.entities.local.tags,
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getListItem: (token, tagId) => {
      dispatch(tagsActions.get(token, tagId))
    },
    setListItem: (tag) => {
      dispatch(tagsActions.set(tag))
    },
    saveListItem: (token, tagId, data) => {
      dispatch(tagsActions.save(token, tagId, data))
    },
    createListItem: (token, data) => {
      dispatch(tagsActions.create(token, data, AFTER_DELETE))
    },
    deleteListItem: (token, tagId, next) => {
      dispatch(tagsActions.delete(token, tagId, next))
    }
  }
}

function TagEditorComponent(props) {
  return (
    <ItemEditor
      type={TYPE}
      typePlural={TYPE_PLURAL}
      afterDelete={AFTER_DELETE}
      form={TagForm}
      {... props} />
  )
}

const TagEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(TagEditorComponent)

export default TagEditor
