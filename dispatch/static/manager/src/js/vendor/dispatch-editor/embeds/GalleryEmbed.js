import React from 'react'

import { GallerySelectInput, TextInput } from '../../../components/inputs'

import * as Form from '../../../components/Form'

class GalleryEmbedComponent extends React.Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (
      <div className='o-embed o-embed--gallery'>
        <Form.Container>
          <Form.Input label='Title'>
            <TextInput
              fill={true}
              value={this.props.data.title}
              placeholder='Title'
              onChange={e => this.props.updateField('title', e.target.value)} />
          </Form.Input>
          <Form.Input label='Gallery'>
            <GallerySelectInput
              fill={true}
              value={this.props.data.id}
              update={id => {
                this.props.updateField('id', id)
                this.props.stopEditing()
              }} />
          </Form.Input>
        </Form.Container>
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
