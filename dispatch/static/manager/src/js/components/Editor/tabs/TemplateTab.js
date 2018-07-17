import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'

import templatesActions from '../../../actions/TemplatesActions'

import { FormInput } from '../../inputs'
import TemplateSelectInput from '../../inputs/selects/TemplateSelectInput'

import FieldGroup from '../../fields/FieldGroup'

class TemplateTabComponent extends React.Component {

  componentDidMount() {
    this.props.getTemplate(this.props.token, this.props.template)
  }

  updateField(name, value) {
    if (value instanceof Date) {
      value = String(value)
    }
    this.props.update(
      'template_data',
      R.assoc(name, value, this.props.data)
    )
  }

  render() {
    const template = this.props.entities.templates[this.props.template] || null
    const fields = (
      <FieldGroup
        name={`template-field__${template.id}`}
        fields={(this.props.data ? (template ? template.fields : []) : null)}
        data={this.props.data}
        errors={this.props.errors}
        onChange={(name, data) => this.updateField(name, data)} />
    )

    return (
      <div>
        <FormInput label='Template'>
          <TemplateSelectInput
            selected={this.props.template}
            update={template => this.props.update('template', template)} />
        </FormInput>
        <div>{fields}</div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const zone = state.app.entities.local.zones[state.app.zones.single.id]
  return {
    zone: zone,
    templates: state.app.templates,
    entities: {
      templates: state.app.entities.templates
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getTemplate: (token, templateId) => {
      dispatch(templatesActions.get(token, templateId))
    }
  }
}

const TemplateTab = connect(
  mapStateToProps,
  mapDispatchToProps
)(TemplateTabComponent)

export default TemplateTab
