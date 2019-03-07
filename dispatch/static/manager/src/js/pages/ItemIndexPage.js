import React from 'react'
import PropTypes from 'prop-types'
import R from 'ramda'
import DocumentTitle from 'react-document-title'

import { Link } from 'react-router'

import { Intent } from '@blueprintjs/core'

import { LinkButton } from '../components/inputs'
import ItemList from '../components/ItemList'

const DEFAULT_LIMIT = 15

export default class ListItemsPageComponent extends React.Component {

  getQuery() {
    console.log(this.props.exclude)
    var query = {
      limit: DEFAULT_LIMIT,
      offset: (this.getCurrentPage() - 1) * DEFAULT_LIMIT,
    }

    // If fields to be excluded, add to query
    if (this.props.exclude) {
      query.exclude = this.props.exclude
    }

    // If listItem is present, add to query
    if (this.props.location.query.listItem) {
      query.listItem = this.props.location.query.listItem
    }

    query = this.props.queryHandler(query, this.props)

    // If search query is present, add to query
    if (this.props.location.query.q) {
      query.q = this.props.location.query.q
    }

    return query
  }

  getCurrentPage() {
    return parseInt(this.props.location.query.page, 10) || 1
  }

  getTotalListItems() {
    return Math.ceil(
      parseInt(this.props.listItems.count, 10) / DEFAULT_LIMIT
    )
  }

  componentWillMount() {
    // Fetch listItems
    this.props.clearListItems()
    this.props.clearSelectedListItems()
    this.props.listListItems(this.props.token, this.getQuery())
  }

  componentDidUpdate(prevProps) {
    if (this.isNewQuery(prevProps, this.props)
      || this.props.shouldReload(prevProps, this.props)) {
      this.props.clearListItems()
      this.props.clearSelectedListItems()
      this.props.listListItems(this.props.token, this.getQuery())
    } else if (this.isNewPage(prevProps, this.props)) {
      // Fetch listItems
      this.props.listListItems(this.props.token, this.getQuery())
      this.props.clearSelectedListItems()
    }
  }

  isNewQuery(prevProps, props) {
    return prevProps.location.query.q !== props.location.query.q
  }

  isNewPage(prevProps, props) {
    // Returns true if page number has changed
    return prevProps.location.query.page !== props.location.query.page
  }

  deleteListItems(listItemIds) {
    let page = this.getCurrentPage()
    if (listItemIds.length == this.props.listItems.ids.length
      && page) {
      page -= 1
    } else {
      page = null // don't change the page
    }
    this.props.deleteListItems(this.props.token, listItemIds, page)
    this.props.clearSelectedListItems()
  }

  render() {
    // The first column will always be a link, as defined here,
    // containing the item property associated with displayColumn
    const columns = this.props.columns || R.insert(0, item => (
      <strong>
        <Link
          to={`/${this.props.typePlural}/${item.id}`}
          dangerouslySetInnerHTML={{__html: item[this.props.displayColumn] || item.name}} />
      </strong>
    // extraColumns are after the main link column
    ), this.props.extraColumns || [])

    return (
      <DocumentTitle title={this.props.pageTitle}>
        <ItemList
          location={this.props.location}

          typeSingular={this.props.typeSingular}
          typePlural={this.props.typePlural}

          currentPage={this.getCurrentPage()}
          totalPages={this.getTotalListItems()}

          items={this.props.listItems}
          entities={this.props.entities.listItems}

          filters={this.props.filters}
          hasFilters={this.props.hasFilters}

          columns={columns}
          headers={this.props.headers}

          emptyMessage={`You haven\'t created any ${this.props.typePlural} yet.`}
          createHandler={() => (
            <LinkButton
              intent={Intent.SUCCESS}
              icon='add'
              to={`${this.props.typePlural}/new`}>
              Create {this.typeString}
            </LinkButton>)
          }

          actions={{
            toggleItem: this.props.toggleListItem,
            toggleAllItems: this.props.toggleAllListItems,
            deleteItems: (listItemIds) => this.deleteListItems(listItemIds),
            searchItems: (query) => this.props.searchListItems(query)
          }}

          toolbarContent={this.props.toolbarContent} />
      </DocumentTitle>
    )
  }

}

ListItemsPageComponent.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  shouldReload: PropTypes.func,
  queryHandler: PropTypes.func
}

ListItemsPageComponent.defaultProps = {
  shouldReload: () => { false },
  queryHandler: (query) => query
}
