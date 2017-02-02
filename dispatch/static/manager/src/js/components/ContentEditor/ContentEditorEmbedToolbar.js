import React from 'react'

export default class ContentEditorEmbedToolbar extends React.Component {

  constructor(props) {
    super(props)

    this.toggleButtons = this.toggleButtons.bind(this)
    this.insertEmbed = this.insertEmbed.bind(this)

    this.state = {
      showButtons: false
    }
  }

  toggleButtons(e) {
    e.preventDefault()
    this.setState({ showButtons: !this.state.showButtons })
  }

  insertEmbed(e, embed) {
    e.preventDefault()

    if (embed.modal) {
      this.props.openModal(embed.modal, {
        onSubmit: function(data) {
          this.props.closeModal()
          this.props.insertEmbed(embed.type, embed.modalCallback(data))
          this.setState({ showButtons: false })
        }.bind(this)
      })
    } else {
      this.props.insertEmbed(embed.type)
      this.setState({ showButtons: false })
    }
  }

  renderButtons() {
    return this.props.embeds.map( embed => {
      return (
        <button key={embed.type} onClick={e => {this.insertEmbed(e, embed)}}>{embed.type}</button>
      )
    })
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.showToolbar && nextProps.showToolbar) {
      this.setState({
        showButtons: false
      })
    }
  }

  render() {

    const style = {
      top: this.props.offset - 4,
      display: this.props.showToolbar ? 'block' : 'none'
    }

    const buttonClass = 'c-content-editor__embed-toolbar__button'

    return (
      <div className='c-content-editor__embed-toolbar' style={style}>
        <div
          className={this.state.showButtons ? `${buttonClass} ${buttonClass}--active` : buttonClass}
          onClick={this.toggleButtons}></div>
        <div className='c-content-editor__embed-toolbar__buttons'>
          {this.state.showButtons ? this.renderButtons() : null}
        </div>
      </div>
    )
  }
}
