import React from 'react'
import R from 'ramda'
import DocumentTitle from 'react-document-title'

import ListItemToolbar from './ListItemToolbar'

const NEW_LISTITEM_ID = 'new'

export default class ItemEditor extends React.Component {

  componentWillMount() {
    if (this.props.isNew) {
      // Create empty listItem
      this.props.setListItem({ id: NEW_LISTITEM_ID })
    } else {
      // Fetch listItem
      this.props.getListItem(this.props.token, this.props.itemId)
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.isNew) {
      // Fetch listItem
      if (prevProps.itemId !== this.props.itemId) {
        this.props.getListItem(this.props.token, this.props.itemId)
      }
    }
  }

  getListItem() {
    if (!this.props.entities.local) {
      // need to wait for GET call to complete
      return
    }

    if (this.props.isNew) {
      return this.props.entities.local[NEW_LISTITEM_ID]
    } else {
      return this.props.entities.local[this.props.itemId] ||
        this.props.entities.remote[this.props.itemId] || false
    }
  }

  saveListItem() {
    if (this.props.isNew) {
      this.props.createListItem(this.props.token, this.getListItem())
    } else {
      this.props.saveListItem(
        this.props.token,
        this.props.itemId,
        this.getListItem()
      )
    }
  }

  handleUpdate(field, value) {
    this.props.setListItem(R.assoc(field, value, this.getListItem()))
  }

  render() {

    const listItem = this.getListItem()

    if (!listItem) {
      return (<div>Loading</div>)
    }

    const title = this.props.isNew ? `New ${this.props.type}` : `Edit - ${listItem[this.props.displayField] || listItem.name}`

    return (
      <DocumentTitle title={title}>
        <div className='u-container-main'>
          <ListItemToolbar
            name={listItem[this.props.displayField] || listItem.name}
            type={this.props.type}
            isNew={this.props.isNew}
            saveListItem={() => this.saveListItem()}
            deleteListItem={() => this.props.deleteListItem(this.props.token, this.props.itemId, this.props.afterDelete)}
            goBack={this.props.goBack} />
          <div className='u-container u-container--padded'>
            <this.props.form
              listItem={listItem}
              errors={listItem.errors}
              update={(field, value) => this.handleUpdate(field, value)} />
          </div>
        </div>
      </DocumentTitle>
    )
  }

}
