import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'

import * as templatesActions from '../../../actions/TemplatesActions'

import { FormInput, TextInput, SelectInput } from '../../inputs'

import TemplateSelectInput from '../../inputs/TemplateSelectInput.jsx'

function renderField(field, value, handleOnChange) {
  switch (field.type) {
    case 'text':
      return (
        <TextInput
          value={value}
          fill={true}
          placeholder={field.label}
          onChange={handleOnChange} /> )
    case 'select':
      let options = field.options.map( option => {
        return { value: option[0], label: option[1] }
      })
      return (
        <SelectInput
          options={options}
          selected={value} onChange={handleOnChange} /> )
  }
}

class TemplateTabComponent extends React.Component {

  constructor(props) {
    super(props)

    this.handleFieldChange = this.handleFieldChange.bind(this)
  }

  componentWillMount() {
    this.props.fetchTemplate(this.props.token, this.props.template)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.template !== nextProps.template) {
      this.props.fetchTemplate(this.props.token, nextProps.template)
    }
  }

  handleFieldChange(field, e) {
    this.props.update(
      'template_fields',
      R.assoc(field.name, e.target.value, this.props.template_fields)
    )
  }

  render() {

    console.log('fields', this.props.template_fields)

    return (
      <div>

        <FormInput label='Template'>
          <TemplateSelectInput
            selected={this.props.template}
            update={ template => this.props.update('template', template) } />
        </FormInput>

        {this.renderTemplateFields()}

      </div>
    )

  }

  renderTemplateFields() {

    let template = this.props.entities.templates[this.props.template]

    template.fields = template.fields || []

    const fields = template.fields.map( field => {
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

    if (template) {
      return (<div>{fields}</div>)
    } else {
      return 'loading fields'
    }
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
    fetchTemplate: (token, templateId) => {
      dispatch(templatesActions.fetchTemplate(token, templateId))
    }
  }
}

const TemplateTab = connect(
  mapStateToProps,
  mapDispatchToProps
)(TemplateTabComponent)

export default TemplateTab
