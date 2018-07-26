import React from 'react'
import { connect } from 'react-redux'

import WidgetField from './ZoneEditor/WidgetField'

class WidgetFieldsComponent extends React.Component {
  render() {
    const widget = this.props.entities.widgets[this.props.widgetId]
    const fields = widget ? widget.fields.map((field) => (
      <WidgetField
        key={`widget-field__${widget.id}__${field.name}`}
        field={field}
        data={this.props.data[field.name] || null}
        onChange={(data) => this.props.updateField(field.name, data)} />
    )) : null

    return (
      <div>
        {fields}
      </div>
    )
  }
}

const mapStateToProps = (state) => {

  return {
    entities: {
      widgets: state.app.entities.widgets
    }
  }
}

const mapDispatchToProps = () => {
  return {}
}

const WidgetFields = connect(
  mapStateToProps,
  mapDispatchToProps
)(WidgetFieldsComponent)

export default WidgetFields
