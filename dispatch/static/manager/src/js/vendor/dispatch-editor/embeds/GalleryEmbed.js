import React from 'react'

import { FormInput, GallerySelectInput, TextInput } from '../../../components/inputs'

class GalleryEmbedComponent extends React.Component {
  constructor(props) {
    super(props)

  }

  render() {
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
              update={id => {
                this.props.updateField('id', id)
                this.props.stopEditing()
              }} />
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
