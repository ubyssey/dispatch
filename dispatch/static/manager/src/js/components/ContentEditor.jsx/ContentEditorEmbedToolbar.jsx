import React from 'react'

export default class ContentEditorEmbedToolbar extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showButtons: false
    }
  }

  renderButtons() {
    return this.props.embeds.map( embed => {
      return (
        <button>{embed.name}</button>
      )
    })
  }

  render() {

    let style = {
      top: this.props.offset,
      display: this.props.showToolbar ? 'block' : 'none'
    }

    return (
      <div className='c-content-editor__embed-toolbar' style={style}>
        <div className='c-content-editor__embed-toolbar__button'>+</div>
        {this.state.showButtons ? this.renderButtons() : null}
      </div>
    )
  }
}
