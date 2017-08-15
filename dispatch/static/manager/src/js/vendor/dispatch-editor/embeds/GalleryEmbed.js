import React from 'react'

import { FormInput, GallerySelectInput, TextInput } from '../../../components/inputs'

class GalleryEmbedComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = { show: false }
    setTimeout(() => { this.setState({ show: true }) }, 1)
  }

  render() {
    if (!this.state.show) { return null }
    return (
      <div className='o-embed o-embed--gallery'>
        <form>
          <FormInput label='Title'>
            <TextInput
              value={this.props.data.title}
              placeholder='Title'
              onChange={e => this.props.updateField('title', e.target.value)} />
          </FormInput>

          <FormInput label='Gallery'>
            <GallerySelectInput
              fill={true}
              selected={this.props.data.id}
              update={id => this.props.updateField('id', id)} />
          </FormInput>
        </form>
      </div>
    )
  }
}

export default {
  type: 'gallery',
  component: GalleryEmbedComponent,
  defaultData: {
    id: null,
    title: ''
  },
  showEdit: false
}
