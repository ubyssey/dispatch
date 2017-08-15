import React from 'react'
import R from 'ramda'

import Panel from '../Panel'
import WidgetSelectInput from '../inputs/WidgetSelectInput'
import WidgetFieldWrapper from '../ZoneEditor/WidgetField'

export default class WidgetFieldComponent extends React.Component {
  handleWidgetChange(widgetId) {
    this.props.onChange({
      id: widgetId,
      data: {}
    })
  }

  updateField(name, data) {
    const widgetData = {}
    widgetData[name] = data

    this.props.onChange(R.merge(this.props.data || {}, {
      data: R.merge(this.props.data.data || {}, widgetData)
    }))
  }

  getWidgetId() {
    return R.prop('id', this.props.data || {})
  }

  getWidget() {
    const id = this.getWidgetId()
    return R.prop(id, this.props.cWidgets || {})
  }

  getWidgetData() {
    return R.prop('data', this.props.data || {})
  }

  render() {
    const widget = this.getWidget()
    const widgetData = this.getWidgetData()

    let fields = widget ? widget.fields.map((field) => (
      <WidgetFieldWrapper
        error={R.prop(field.name, this.props.errors || {})}
        key={`widget-field__${widget.id}__${field.name}`}
        field={field}
        data={R.prop(field.name, widgetData || {}) || null}
        onChange={(data) => this.updateField(field.name, data)} />
    )) : null

    if (fields) {
      fields = (
        <Panel title={`Edit ${this.props.label}`}>
          {fields}
        </Panel>
      )
    }

    return (
      <div>
        <div className='c-input--widget-field__select-wrapper'>
          <WidgetSelectInput
            cWidgets={this.props.cWidgets}
            selected={this.getWidgetId()}
            update={widgetId => this.handleWidgetChange(widgetId)} />
        </div>
      {fields}
      </div>
    )
  }
}
