import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'

import * as zonesActions from '../../actions/ZonesActions'

import ListItemToolbar from '../ItemEditor/ListItemToolbar'
import WidgetField from './WidgetField'

import WidgetSelectInput from '../inputs/WidgetSelectInput'

class ZoneEditorComponent extends React.Component {

  componentWillMount() {
    this.props.getZone(this.props.token, this.props.zoneId)
  }

  updateField(name, data) {
    let zone = this.props.zone
    zone.widget.data = R.assoc(name, data, zone.widget.data)
    this.props.setZone(zone)
  }

  updateWidget(widget) {
    let zone = this.props.zone
    widget.data = {}
    zone.widget = widget
    this.props.setZone(zone)
  }

  saveZone() {
    this.props.saveZone(this.props.token, this.props.zoneId, this.props.zone)
  }

  render() {

    if (!this.props.zone) {
      return (<div>Loading</div>)
    }

    const fields = this.props.zone.widget ? this.props.zone.widget.fields.map((field) => (
      <WidgetField
        key={field.name}
        field={field}
        data={this.props.zone.widget.data[field.name] || null}
        onChange={(data) => this.updateField(field.name, data)} />
    )) : null

    return (
      <DocumentTitle title={`Widgets - ${this.props.zone.name}`}>
        <div className='u-container-main'>
          <ListItemToolbar
            name={this.props.zone.name}
            type='Zone'
            saveListItem={() => this.saveZone()}
            goBack={this.props.goBack} />
          <div className='u-container u-container--padded'>
            <WidgetSelectInput
              zoneId={this.props.zoneId}
              selected={this.props.zone.widget}
              update={widget => this.updateWidget(widget)} />
            {fields}
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    zone: state.app.entities.local.zones[state.app.zones.single.id],
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
