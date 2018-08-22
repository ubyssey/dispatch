import React from 'react'

import ItemListHeader from './ItemListHeader'
import ItemListFilters from './ItemListFilters'
import ItemListTable from './ItemListTable'

require('../../../styles/components/item_list.scss')

export default class ItemList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showFilters: this.props.hasFilters || false
    }
  }

  toggleFilters() {
    this.setState({ showFilters: !this.state.showFilters })
  }

  render() {
    const hasFilters = !!this.props.filters

    return (
      <div className='c-item-list'>
        <ItemListHeader
          items={this.props.items}
          typeSingular={this.props.typeSingular}
          typePlural={this.props.typePlural}
          location={this.props.location}
          currentPage={this.props.currentPage}
          totalPages={this.props.totalPages}
          createHandler={this.props.createHandler}
          toolbarContent={this.props.toolbarContent}
          hasFilters={hasFilters}
          toggleFilters={() => this.toggleFilters()}
          showFilters={this.state.showFilters}
          actions={this.props.actions || {}} />
        {hasFilters && this.state.showFilters && <ItemListFilters filters={this.props.filters} />}
        <ItemListTable
          items={this.props.items}
          entities={this.props.entities}
          columns={this.props.columns}
          headers={this.props.headers}
          location={this.props.location}
          emptyMessage={this.props.emptyMessage}
          createHandler={this.props.createHandler}
          actions={this.props.actions || {}} />
      </div>
    )
  }
}
