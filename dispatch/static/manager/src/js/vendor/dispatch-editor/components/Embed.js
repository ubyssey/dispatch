import React from 'react'
import R from 'ramda'
import {Entity} from 'draft-js'

require('../styles/embeds/embed.scss')

export default class Embed extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      editMode: false,
      data: this.getData()
    }
  }

  getData() {
    return Entity.get(this.props.block.getEntityAt(0)).getData()
  }

  removeEmbed() {
    this.props.blockProps.removeEmbed(this.props.block.getKey())
  }

  updateField(field, value) {
    Entity.mergeData(
      this.props.block.getEntityAt(0),
      R.assoc(field, value, {})
    )
    this.forceUpdate()
  }

  startEditing() {
    this.setState({ editMode: true })
    this.props.blockProps.onFocus()
  }

  stopEditing() {
    this.setState({ editMode: false })
    this.props.blockProps.onBlur()
  }

  updateEntity() {
    Entity.mergeData(this.props.block.getEntityAt(0), this.state.data)
  }

  render() {

    const embedProps = {
      data: this.getData(),
      updateField: (field, value) => this.updateField(field, value),
      stopEditing: this.stopEditing
    }

    const editButton = this.props.blockProps.showEdit ? (
      <li>
        <a onClick={() => this.updateEmbed()}>
          <span className='pt-icon-standard pt-icon-edit'></span>
          <span>Edit</span>
        </a>
      </li>
    ) : null

    return (
      <div
        className='o-embed-container'
        onFocus={() => this.startEditing()}
        onBlur={() => this.stopEditing()} >
        <div className='o-embed-container__header'>
          <div className='o-embed-container__header__title'>{this.props.blockProps.type}</div>
          <ul className='o-embed-container__header__options'>
            {editButton}
            <li>
              <a onClick={() => this.removeEmbed()}>
                <span className='pt-icon-standard pt-icon-trash'></span>
                <span>Remove</span>
              </a>
            </li>
          </ul>
        </div>
        <div className='o-embed-container__body'>
          <this.props.blockProps.embedComponent {...embedProps} />
        </div>
      </div>
    )
  }

}
