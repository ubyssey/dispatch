import React from 'react'
import R from 'ramda'
import {Entity} from 'draft-js'

export default class ContentEditorEmbed extends React.Component {

  constructor(props) {
    super(props)

    this.startEditing = this.startEditing.bind(this)
    this.stopEditing = this.stopEditing.bind(this)
    this.updateField = this.updateField.bind(this)

    this.state = {
      editMode: false,
      data: this.getData()
    }
  }

  changeEmbed() {

  }

  updateField(field, value) {
    this.setState({
      data: R.assoc(field, value, this.state.data)
    })
  }

  getData() {
    return Entity.get(this.props.block.getEntityAt(0)).getData()
  }

  startEditing() {
    this.setState({ editMode: true })
    this.props.blockProps.onFocus()
  }

  stopEditing() {

    Entity.mergeData(this.props.block.getEntityAt(0), this.state.data)

    this.setState({ editMode: false })
    this.props.blockProps.onBlur()
  }

  render() {
    const embedProps = {
      data: this.state.editMode ? this.state.data : this.getData(),
      updateField: this.updateField
    }

    return (
      <div
        className='o-embed-container'
        onFocus={this.startEditing}
        onBlur={this.stopEditing} >
        <div className='o-embed-container__header'>
          <div className='o-embed-container__header__title'>{this.props.blockProps.type}</div>
          <ul className='o-embed-container__header__options'>
            <li onClick={this.}>Change</li>
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
