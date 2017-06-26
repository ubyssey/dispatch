import React from 'react'

export default class EmbedToolbar extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      showButtons: false
    }
  }

  toggleButtons() {
    this.setState({ showButtons: !this.state.showButtons })
  }

  insertEmbed(e, embed) {
    e.preventDefault()
    this.props.insertEmbed(embed.type, embed.defaultData)
    this.setState({ showButtons: false })
  }

  renderButtons() {
    return this.props.embeds.map( embed => {
      return (
        <button
          key={embed.type}
          onClick={e => this.insertEmbed(e, embed)}>{embed.type}</button>
      )
    })
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.showToolbar && nextProps.showToolbar) {
      this.setState({ showButtons: false })
    }
  }

  render() {
    const style = {
      top: this.props.offset - 4,
      display: this.props.showToolbar ? 'block' : 'none'
    }

    const buttonClass = 'c-dispatch-editor__embed-toolbar__button'

    return (
      <div className='c-dispatch-editor__embed-toolbar' style={style}>
        <div
          className={this.state.showButtons ? `${buttonClass} ${buttonClass}--active` : buttonClass}
          onClick={() => this.toggleButtons()}></div>
        <div className='c-dispatch-editor__embed-toolbar__buttons'>
          {this.state.showButtons ? this.renderButtons() : null}
        </div>
      </div>
    )
  }
}
