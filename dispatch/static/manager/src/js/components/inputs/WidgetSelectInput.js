import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'

import ItemSelectInput from './ItemSelectInput'

import * as zonesActions from '../../actions/ZonesActions'

class WidgetSelectInputComponent extends React.Component {

  listWidgets(query) {
    if (!this.props.zoneId) {
      return
    }
    let queryObj = {}

    if (query) {
      queryObj['q'] = query
    }

    this.props.listWidgets(this.props.token, this.props.zoneId, queryObj)
  }

  render() {
    const results = this.props.cWidgets ? R.keys(this.props.cWidgets) : this.props.widgets.zones[this.props.zoneId]
    const entities = this.props.cWidgets || this.props.entities.widgets
    
    return (
      <ItemSelectInput
        many={false}
        selected={this.props.selected}
        results={results}
        entities={entities}
        onChange={(selected) => this.props.update(selected)}
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
