import React from 'react'
import { connect } from 'react-redux'
import DocumentTitle from 'react-document-title'
import { Link } from 'react-router'

import ItemList from '../../components/ItemList'

import * as zonesActions from '../../actions/ZonesActions'

const DEFAULT_LIMIT = 15

class ZoneIndexPageComponent extends React.Component {

  componentWillMount() {
    this.props.listZones(this.props.token, this.getQuery())
  }

  componentDidUpdate(prevProps) {
    if (this.isNewQuery(prevProps, this.props)) {
      this.props.listZones(this.props.token, this.getQuery())
    }
  }

  getQuery() {
    var query = {
      limit: DEFAULT_LIMIT,
    }

    if (this.props.location.query.q) {
      query.q = this.props.location.query.q
    }
    return query
  }

  isNewQuery(prevProps, props) {
    return prevProps.location.query.q !== props.location.query.q
  }

  handleSearchZones(query) {
    this.props.searchZones(query)
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

          actions={{
            searchItems: (query) => this.handleSearchZones(query)
          }}
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
    },
    searchZones: (query) => {
      dispatch(zonesActions.search(query))
    }
  }
}


const ZoneIndexPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(ZoneIndexPageComponent)

export default ZoneIndexPage
