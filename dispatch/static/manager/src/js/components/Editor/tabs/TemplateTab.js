import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'

import templatesActions from '../../../actions/TemplatesActions'

import { FormInput, TextInput, SelectInput } from '../../inputs'

import TemplateSelectInput from '../../inputs/TemplateSelectInput'

function renderSelectField(field, value, handleOnChange) {

  let options = field.options.map( option => {
    return { value: option[0], label: option[1] }
  })

  return (
    <SelectInput
      options={options}
      selected={value} onChange={handleOnChange} /> )
}

function renderTextField(field, value, handleOnChange) {
  return (
    <TextInput
      value={value}
      fill={true}
      placeholder={field.label}
      onChange={handleOnChange} /> )
}

function renderField(field, value, handleOnChange) {
  switch (field.type) {
  case 'text':
    return renderTextField(field, value, handleOnChange)
  case 'select':
    return renderSelectField(field, value, handleOnChange)
  }
}

class TemplateTabComponent extends React.Component {

  constructor(props) {
    super(props)

    this.handleFieldChange = this.handleFieldChange.bind(this)
  }

  componentWillMount() {
    this.props.getTemplate(this.props.token, this.props.template)
  }

  handleFieldChange(field, e) {
    this.props.update(
      'template_fields',
      R.assoc(field.name, e.target.value, this.props.template_fields)
    )
  }

  render() {

    let template = this.props.entities.templates[this.props.template] || false

    if (template) {

      return (
        <div>

          <FormInput label='Template'>
            <TemplateSelectInput
              selected={this.props.template}
              update={ template => this.props.update('template', template) } />
          </FormInput>

          <div>{this.renderTemplateFields(template)}</div>

        </div>
      )

    } else {
      return (
        <div>Loading</div>
      )
    }

  }

  renderTemplateFields(template) {

    template.fields = template.fields || []

    return template.fields.map( field => {
      let value = this.props.template_fields[field.name]
      return (
        <FormInput key={field.name} label={field.label}>
          {renderField(
            field,
            value,
            e => this.handleFieldChange(field, e)
          )}
        </FormInput>
      )
    })

  }

}

const mapStateToProps = (state) => {
  return {
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
