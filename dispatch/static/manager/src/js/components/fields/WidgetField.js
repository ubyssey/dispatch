import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'

import Panel from '../Panel'
import WidgetSelectInput from '../inputs/WidgetSelectInput'
import WidgetFieldWrapper from '../ZoneEditor/WidgetField'

class WidgetFieldComponent extends React.Component {
  handleWidgetChange(widgetId) {
    const data = R.merge(this.props.data || {}, {
      id: widgetId,
      data: this.props.data || {}
    })

    this.props.onChange(data)
  }

  updateField(name, data) {
    const newInnerData = {}
    newInnerData[name] = data

    const newData = R.merge(this.props.data || {}, {
      data: R.merge(this.props.data.data || {}, newInnerData)
    })

    this.props.onChange(newData)
  }

  getWidgetId() {
    return R.prop('id', this.props.data || {})
  }

  getWidget() {
    return R.prop(this.getWidgetId(), this.props.widgets || {})
  }

  getWidgetData() {
    return R.prop('data', this.props.data || {})
  }

  render() {
    const widget = this.getWidget()
    const fields = widget ? widget.fields.map((field) => (
      <WidgetFieldWrapper
        // nested widget's fields aren't validated! (fix this)
        // error={this.props.errors[field.name]}
        key={`widget-field__${widget.id}__${field.name}`}
        field={field}
        data={this.getWidgetData()[field.name] || null}
        onChange={(data) => this.updateField(field.name, data)} />
    )) : null

    return (
      <div>
        <WidgetSelectInput
          zoneId={this.props.zone_id}
          selected={this.getWidgetId()}
          update={widgetId => this.handleWidgetChange(widgetId)} />
        <Panel title={`Edit ${this.props.label}`}>
          {fields}
        </Panel>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    widgets: state.app.entities.widgets
  }
}

const mapDispatchToProps = () => {
  return {}
}

const WidgetField = connect(
  mapStateToProps,
  mapDispatchToProps
)(WidgetFieldComponent)

export default WidgetField
