import React from 'react'
import { connect } from 'react-redux'

import MultiSelectInput from './MultiSelectInput'

import * as templatesActions from '../../actions/TemplatesActions'

class TemplateSelectInputComponent extends React.Component {

  constructor(props) {
    super(props)

    this.addTemplate = this.addTemplate.bind(this)
    this.removeTemplate = this.removeTemplate.bind(this)
    this.fetchTemplates = this.fetchTemplates.bind(this)
  }

  addTemplate(templateId) {
    this.props.update(templateId)
  }

  removeTemplate() {
    this.props.update(null)
  }

  fetchTemplates(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.fetchTemplates(this.props.token, queryObj)
  }

  render() {

    return (
      <MultiSelectInput
        selected={this.props.selected ? [this.props.selected] : []}
        results={this.props.templates.data}
        entities={this.props.entities.templates}
        addValue={this.addTemplate}
        removeValue={this.removeTemplate}
        fetchResults={this.fetchTemplates}
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
    fetchTemplates: (token, query) => {
      dispatch(templatesActions.fetchTemplates(token, query))
    }
  }
}

const TemplateSelectInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(TemplateSelectInputComponent)

export default TemplateSelectInput
