import React from 'react'
import { connect } from 'react-redux'

import issuesActions from '../../actions/IssuesActions'
import IssueForm from './IssueForm'

import ItemEditor from '../ItemEditor'

const TYPE = 'Issue'
const AFTER_DELETE = 'issues'

const mapStateToProps = (state) => {
  return {
    listItem: state.app.issues.single,
    entities: {
      remote: state.app.entities.issues,
      local: state.app.entities.local.issues,
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getListItem: (token, issueId) => {
      dispatch(issuesActions.get(token, issueId))
    },
    setListItem: (issue) => {
      dispatch(issuesActions.set(issue))
    },
    saveListItem: (token, issueId, data) => {
      dispatch(issuesActions.save(token, issueId, data))
    },
    createListItem: (token, data) => {
      dispatch(issuesActions.create(token, data, AFTER_DELETE))
    },
    deleteListItem: (token, issueId, next) => {
      dispatch(issuesActions.delete(token, issueId, next))
    }
  }
}

function IssueEditorComponent(props) {
  return (
    <ItemEditor
      type={TYPE}
      afterDelete={AFTER_DELETE}
      displayField='title'
      form={IssueForm}
      {... props} />
  )
}

const IssueEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(IssueEditorComponent)

export default IssueEditor
