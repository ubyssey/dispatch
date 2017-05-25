import React from 'react'
import DocumentTitle from 'react-document-title'

import { Link } from 'react-router'

import { Intent } from '@blueprintjs/core'

import { LinkButton } from '../components/inputs'
import ItemList from '../components/ItemList'

const DEFAULT_LIMIT = 15

export default class ListItemsPageComponent extends React.Component {

  getQuery() {
    var query = {
      limit: DEFAULT_LIMIT,
      offset: (this.getCurrentPage() - 1) * DEFAULT_LIMIT
    }

    // If listItem is present, add to query
    if (this.props.location.query.listItem) {
      query.listItem = this.props.location.query.listItem
    }

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

    if (this.isNewQuery(prevProps, this.props)) {
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
    // Make the title start with uppercase letter
    const titleString = this.props.typePlural.replace(/^\w/, m => m.toUpperCase())

    return (
      <DocumentTitle title={titleString}>
        <ItemList
          location={this.props.location}

          typeSingular={this.props.typeSingular}
          typePlural={this.props.typePlural}

          currentPage={this.getCurrentPage()}
          totalPages={this.getTotalListItems()}

          items={this.props.listItems}
          entities={this.props.entities.listItems}

          columns={[
            item => (<strong><Link to={`/${this.props.typePlural}/${item.id}`} dangerouslySetInnerHTML={{__html: item[this.props.displayColumn] || item.name}} /></strong>),
            item => item.slug
          ]}

          emptyMessage={`You haven\'t created any ${this.props.typePlural} yet.`}
          createHandler={() => (
            <LinkButton intent={Intent.SUCCESS} to={`${this.props.typePlural}/new`}>
              <span className='pt-icon-standard pt-icon-add'></span>Create {this.typeString}
            </LinkButton>)
          }

          actions={{
            toggleItem: this.props.toggleListItem,
            toggleAllItems: this.props.toggleAllListItems,
            deleteItems: (listItemIds) => this.deleteListItems(listItemIds),
            searchItems: (query) => this.props.searchListItems(query)
          }}

          />
      </DocumentTitle>
    )
  }

}
