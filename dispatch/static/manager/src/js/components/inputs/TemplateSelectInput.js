import React from 'react'
import { connect } from 'react-redux'

import MultiSelectInput from './MultiSelectInput'

import * as templatesActions from '../../actions/TemplatesActions'

class TemplateSelectInputComponent extends React.Component {

  addTemplate(templateId) {
    this.props.update(templateId)
  }

  removeTemplate() {
    this.props.update(null)
  }

  listTemplates(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.listTemplates(this.props.token, queryObj)
  }

  render() {

    return (
      <MultiSelectInput
        selected={this.props.selected ? [this.props.selected] : []}
        results={this.props.templates.ids}
        entities={this.props.entities.templates}
        addValue={(id) => this.addTemplate(id)}
        removeValue={(id) => this.removeTemplate(id)}
        fetchResults={(query) => this.listTemplates(query)}
        attribute='name'
        editMessage={this.props.selected ? 'Change template' : 'Set template'} />
    )
  }

}

const mapStateToProps = (state) => {
  return {
    templates: state.app.templates,
    entities: {
      templates: state.app.entities.templates
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listTemplates: (token, query) => {
      dispatch(templatesActions.list(token, query))
    }
  }
}

const TemplateSelectInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(TemplateSelectInputComponent)

export default TemplateSelectInput
