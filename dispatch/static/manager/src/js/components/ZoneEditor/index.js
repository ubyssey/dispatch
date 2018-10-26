import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'

import * as zonesActions from '../../actions/ZonesActions'

import * as Form from '../Form'
import Panel from '../Panel'
import FieldGroup from '../fields/FieldGroup'
import ListItemToolbar from '../ItemEditor/ListItemToolbar'
import WidgetSelectInput from '../inputs/selects/WidgetSelectInput'

class ZoneEditorComponent extends React.Component {

  componentDidMount() {
    this.props.getZone(this.props.token, this.props.zoneId)
  }

  updateField(name, data) {
    this.props.setZone(
      R.assoc('data', R.assoc(name, data, this.props.zone.data), this.props.zone)
    )
  }

  updateWidget(widgetId) {
    this.props.setZone(
      R.assoc('widget', widgetId, this.props.zone)
    )
  }

  processZone(zone) {
    if (!zone) {
      return zone
    }

    return processNestedWidgets(
      zone, 
      R.prop('fields', this.props.widget || {})
    )
  }

  saveZone() {
    this.props.saveZone(this.props.token, this.props.zoneId, this.processZone(this.props.zone))
  }

  hasNestedWidgets() {
    let fields = this.props.widget.fields
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].type == 'widget') {
        return true
      }
    }
    return false
  }

  render() {
    if (!this.props.zone) {
      return (<div>Loading</div>)
    }

    const widget = this.props.widget || {}

    const fields = (
      <FieldGroup
        title='Fields'
        name={`widget-field__${widget.id}`}
        fields={widget.fields}
        data={this.props.zone.data}
        errors={this.props.errors || {}}
        onChange={(name, data) => this.updateField(name, data)} />
    )

    return (
      <DocumentTitle title={`Widgets - ${this.props.zone.name}`}>
        <div className='u-container-main'>
          <ListItemToolbar
            name={this.props.zone.name}
            type='Zone'
            typePlural='Zones'
            saveListItem={() => this.saveZone()}
            listRoute='zones' />
          <div className='u-container-body u-container--vscroll'>
            <Panel title='Widget'>
              <Form.Input>
                <WidgetSelectInput
                  zoneId={this.props.zoneId}
                  value={this.props.zone.widget}
                  update={widgetId => this.updateWidget(widgetId)} />
              </Form.Input>
            </Panel>
            {fields}
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

function processNestedWidgets(widget, fields) {
  if (!fields) {
    return widget
  }

  fields.forEach((field) => {
    if (field.type == 'widget') {
      const newWidget = R.path(['data', field.name], widget)

      if (newWidget) {

        widget.data[field.name] = processNestedWidgets(
          newWidget, 
          R.path(['widget', 'fields'], newWidget)
        )

        widget = R.dissocPath(['data', field.name, 'widget'], widget)
      }
    }
  })

  return widget
}

const mapStateToProps = (state) => {
  const zone = state.app.entities.local.zones[state.app.zones.single.id]
  const widget = zone ? state.app.entities.widgets[zone.widget] : null

  return {
    zone: zone,
    widget: widget,
    token: state.app.auth.token,
    errors: state.app.zones.single.errors
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getZone: (token, zoneId) => {
      dispatch(zonesActions.get(token, zoneId))
    },
    setZone: (data) => {
      dispatch(zonesActions.set(data))
    },
    saveZone: (token, zoneId, data) => {
      dispatch(zonesActions.save(token, zoneId, data))
    }
  }
}

const ZoneEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(ZoneEditorComponent)

export default ZoneEditor
