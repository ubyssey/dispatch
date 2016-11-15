import React from 'react'

import ImageManager from '../../modals/ImageManager.jsx'

import { FormInput, TextInput } from '../../inputs'

class ImageEmbedComponent extends React.Component {

  constructor(props) {
    super(props)

    this.handleCaptionChange = this.handleCaptionChange.bind(this)
    this.handleCreditChange = this.handleCreditChange.bind(this)
  }

  handleCaptionChange(e) {
    e.preventDefault()
    this.props.updateField('caption', e.target.value)
  }

  handleCreditChange(e) {
    e.preventDefault()
    this.props.updateField('credit', e.target.value)
  }

  render() {
    return (
      <div className='o-embed o-embed--image'>
        <img className='o-embed--image__image' src={this.props.data.url} />
        <form>
          <FormInput label='Caption'>
            <TextInput
              value={this.props.data.caption}
              onChange={this.handleCaptionChange} />
          </FormInput>
          <FormInput label='Custom Credit'>
            <TextInput
              value={this.props.data.credit || ''}
              onChange={this.handleCreditChange} />
          </FormInput>
        </form>
      </div>
    )
  }

}

export default {
  type: 'IMAGE',
  component: ImageEmbedComponent,
  modal: ImageManager,
  modalCallback: (image) => {
    return image
  }
}
