import React from 'react'
import Dropzone from 'react-dropzone'
import { AnchorButton, Intent } from '@blueprintjs/core'

import { FormInput, TextInput, TextAreaInput } from '../inputs'

require('../../../styles/components/person_form.scss')

export default class PersonForm extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      displayImg: null
    }
  }

  onDrop(files) {
    this.props.update('image', files[0])
    this.setState({ displayImg: files[0].preview })
  }

  render() {
    return (
      <form onSubmit={e => e.preventDefault()}>
        <FormInput
          label='Full Name'
          padded={false}
          error={this.props.errors ? this.props.errors.full_name : null}>
          <TextInput
            placeholder='Full Name'
            value={this.props.listItem.full_name || ''}
            fill={true}
            onChange={ e => this.props.update('full_name', e.target.value) } />
        </FormInput>
        <FormInput
          label='Slug'
          padded={false}
          error={this.props.errors ? this.props.errors.slug : null}>
          <TextInput
            placeholder='Full Name'
            value={this.props.listItem.slug || ''}
            fill={true}
            onChange={ e => this.props.update('slug', e.target.value) } />
        </FormInput>

        <Dropzone
          ref={(node) => { this.dropzone = node }}
          className='c-person-form__image__dropzone'
          onDrop={(files) => this.onDrop(files)}
          disableClick={true}
          activeClassName='c-person-form__image__dropzone--active'>
          <div
            className='c-person-form__images__container'>
            {this.state.displayImg || this.props.listItem.image ? null :
              <div className='c-person-form__image__dropzone__text'>
                Drop Image Here
              </div>}
            <img
              className='c-person-form__images'
              ref={(node) => { this.images = node }}
              src={this.state.displayImg || this.props.listItem.image}/>
          </div>
        </Dropzone>

        <div className='c-person-form__image__button'>
          <AnchorButton
            intent={Intent.SUCCESS}
            onClick={() => this.dropzone.open()}>Select Image</AnchorButton>
        </div>


        <FormInput
          label='Description'
          padded={false}
          error={this.props.errors ? this.props.errors.description : null}>
          <TextAreaInput
            placeholder='Description'
            value={this.props.listItem.description || ''}
            fill={true}
            onChange={ e => this.props.update('description', e.target.value) } />
        </FormInput>
      </form>
    )
  }
}
