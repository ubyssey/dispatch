import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'

import * as zonesActions from '../../actions/ZonesActions'

import ListItemToolbar from '../ItemEditor/ListItemToolbar'

import Panel from '../Panel'

import WidgetField from './WidgetField'
import WidgetSelector from './WidgetSelector'

class ZoneEditorComponent extends React.Component {

  componentWillMount() {
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

  saveZone() {
    this.props.saveZone(this.props.token, this.props.zoneId, this.props.zone)
  }

  render() {

    if (!this.props.zone) {
      return (<div>Loading</div>)
    }

    const fields = this.props.widget ? this.props.widget.fields.map((field) => (
      <WidgetField
        key={field.name}
        field={field}
        data={this.props.zone.data[field.name] || null}
        onChange={(data) => this.updateField(field.name, data)} />
    )) : null

    return (
      <DocumentTitle title={`Widgets - ${this.props.zone.name}`}>
        <div>
          <div className='u-container-main'>
            <ListItemToolbar
              name={this.props.zone.name}
              type='Zone'
              saveListItem={() => this.saveZone()}
              goBack={this.props.goBack} />
            <div className='u-container-body'>
              <Panel title='Widget'>
                <WidgetSelector
                  zoneId={this.props.zoneId}
                  selected={this.props.zone.widget}
                  update={widgetId => this.updateWidget(widgetId)} />
              </Panel>
              <Panel title='Fields'>
              {fields}
              </Panel>
            </div>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

const mapStateToProps = (state) => {
  const zone = state.app.entities.local.zones[state.app.zones.single.id]
  const widget = zone ? state.app.entities.widgets[zone.widget] : null

  return {
    zone: zone,
    widget: widget,
    token: state.app.auth.token
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
