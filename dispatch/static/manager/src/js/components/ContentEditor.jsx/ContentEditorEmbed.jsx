import React from 'react'
import R from 'ramda'
import {Entity} from 'draft-js'

export default class ContentEditorEmbed extends React.Component {

  constructor(props) {
    super(props)

    this._startEditing = this._startEditing.bind(this)
    this._stopEditing = this._stopEditing.bind(this)
    this._updateField = this._updateField.bind(this)

    this.state = {
      editMode: false,
      data: this._getData()
    }
  }

  _updateField(field, value) {
    this.setState({
      data: R.assoc(field, value, this.state.data)
    })
  }

  _getData() {
    return Entity.get(this.props.block.getEntityAt(0)).getData()
  }

  _startEditing() {
    this.setState({ editMode: true })
    this.props.blockProps.onFocus()
  }

  _stopEditing() {

    Entity.mergeData(this.props.block.getEntityAt(0), this.state.data)

    this.setState({ editMode: false })
    this.props.blockProps.onBlur()
  }

  render() {
    const embedProps = {
      data: this.state.editMode ? this.state.data : this._getData(),
      updateField: this._updateField
    }

    return (
      <div
        className='o-embed-container'
        onFocus={this._startEditing}
        onBlur={this._stopEditing} >
        <div className='o-embed-container__header'>
          <div className='o-embed-container__title'>{this.props.type}</div>
          <ul className='o-embed-container__options'>
            <li>Change</li>
            <li>Remove</li>
          </ul>
        </div>
        <div className='o-embed-container__body'>
          <this.props.blockProps.embedComponent {...embedProps} />
        </div>
      </div>
    )
  }

}
