import React from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { Link } from 'react-router'

import ItemList from '../../components/ItemList'

import * as zonesActions from '../../actions/ZonesActions'

class ZoneIndexPageComponent extends React.Component {

  componentWillMount() {
    this.props.listZones(this.props.token)
  }

  render() {

    return (
      <DocumentTitle title='Widgets'>
        <ItemList
          location={this.props.location}

          typeSingular='zone'
          typePlural='zones'

          currentPage={1}
          totalPages={1}

          items={this.props.zones}
          entities={this.props.entities.zones}

          headers={['Zone', 'Current Widget']}
          columns={[
            zone => (<strong><Link to={`/widgets/${zone.id}`} dangerouslySetInnerHTML={{__html: zone.name}} /></strong>),
            zone => zone.widget ? this.props.entities.widgets[zone.widget].name : 'No widget'
          ]}

          emptyMessage={'You haven\'t defined any zones yet.'}

          />
      </DocumentTitle>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token,
    zones: state.app.zones.list,
    entities: {
      zones: state.app.entities.zones,
      widgets: state.app.entities.widgets
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listZones: (token, query) => {
      dispatch(zonesActions.list(token, query))
    }
  }
}


const ZoneIndexPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ZoneIndexPageComponent)

export default ZoneIndexPage
