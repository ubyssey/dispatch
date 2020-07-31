import React from 'react'
import R from 'ramda'
import { Entity } from 'draft-js'
import { Button } from '@blueprintjs/core'
//import {getContentState} from '../components/Editor'
//import ContentEditor from '../components/Editor'
require('../styles/embeds/embed.scss')

export default class Embed extends React.Component {

  constructor(props) {
    super(props)
    console.log("embed")
    this.state = {
      editMode: false,
      data: this.getData()
    }
  }

  getData() {
    //console.log(ContentEditor.getContentState())
    //console.log(Entity.get(this.props.block.getEntityAt(0)).getData())
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
      stopEditing: () => this.stopEditing()
    }

    return (
      <div
        className='o-embed-container'
        onFocus={() => this.startEditing()}
        onBlur={() => this.stopEditing()} >
        <div className='o-embed-container__header'>
          <Button
            minimal={true}
            icon='cross'
            onClick={() => this.removeEmbed()} />
        </div>
        <div className='o-embed-container__body'>
          <this.props.blockProps.embedComponent {...embedProps} />
        </div>
      </div>
    )
  }

}
