import React from 'react'
import R from 'ramda'
import {Entity} from 'draft-js'

require('../../../styles/components/embeds/embed_container.scss')

export default class ContentEditorEmbed extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      editMode: false,
      data: this.getData()
    }
  }

  updateEmbed() {

    this.props.blockProps.openModal(this.props.blockProps.modal, {
      onSubmit: data => {

        this.props.blockProps.closeModal()

        let newData = R.merge(
          this.state.data,
          this.props.blockProps.modalCallback(data)
        )

        // Update entity and state
        Entity.mergeData(this.props.block.getEntityAt(0), newData)
        this.setState({ data: newData }, this.render)

      }
    })

  }

  removeEmbed(e) {
    this.props.blockProps.removeEmbed(this.props.block.getKey())
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

  updateEntity() {
    Entity.mergeData(this.props.block.getEntityAt(0), this.state.data)
  }

  render() {

    const embedProps = {
      data: this.state.editMode ? this.state.data : this.getData(),
      updateField: (field, value) => this.updateField(field, value),
      stopEditing: this.stopEditing
    }

    return (
      <div
        className='o-embed-container'
        onFocus={e => this.startEditing()}
        onBlur={e => this.stopEditing()} >
        <div className='o-embed-container__header'>
          <div className='o-embed-container__header__title'>{this.props.blockProps.type}</div>
          <ul className='o-embed-container__header__options'>
            <li>
              <a onClick={e => this.updateEmbed()}>
                <span className='pt-icon-standard pt-icon-edit'></span>
                <span>Edit</span>
              </a>
            </li>
            <li>
              <a onClick={e => this.removeEmbed()}>
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
