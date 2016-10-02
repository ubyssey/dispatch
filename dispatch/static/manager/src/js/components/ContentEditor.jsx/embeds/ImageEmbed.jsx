import React from 'react'

export default class ImageEmbed extends React.Component {

  constructor(props) {
    super(props)

    this.onChange = this.onChange.bind(this)
  }

  onChange(e) {
    e.preventDefault()
    this.props.updateField('caption', e.target.value)
  }

  render() {
    return (
      <div>
        <img style={{width: '100%', height: 'auto'}} src={this.props.data.src} />
        <input
          type='text'
          placeholder='Caption'
          value={this.props.data.caption}
          onChange={this.onChange} />
      </div>
    )
  }

}
