import React from 'react'
import { connect } from 'react-redux'

import MultiSelectInput from './MultiSelectInput'

import * as zonesActions from '../../actions/ZonesActions'

class WidgetSelectInputComponent extends React.Component {

  addWidget(widgetId) {
    this.props.update(widgetId)
  }

  removeWidget() {
    this.props.update(null)
  }

  listWidgets(query) {
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.listWidgets(this.props.token, this.props.zoneId, queryObj)
  }

  render() {
    return (
      <MultiSelectInput
        selected={this.props.selected ? [this.props.selected] : []}
        results={this.props.widgets.ids}
        entities={this.props.entities.widgets}
        addValue={(id) => this.addWidget(id)}
        removeValue={(id) => this.removeWidget(id)}
        fetchResults={(query) => this.listWidgets(query)}
        attribute='name'
        editMessage={this.props.selected ? 'Change widget' : 'Set widget'} />
    )
  }

}

const mapStateToProps = (state) => {
  return {
    widgets: state.app.widgets.list,
    entities: {
      widgets: state.app.entities.widgets
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listWidgets: (token, zoneId, query) => {
      dispatch(zonesActions.listWidgets(token, zoneId, query))
    }
  }
}

const WidgetSelectInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(WidgetSelectInputComponent)

export default WidgetSelectInput
