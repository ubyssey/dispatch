import React from 'react'

class CopyToClipboard extends React.Component{
  render(){
    return (
      <div>
        <textarea
          ref={(node) => { this.txtInput=node }}
          value={this.props.text} />
        <button 
          className="bp3-button bp3-icon-large bp3-icon-clipboard" 
          onClick={() => { this.txtInput.select(); document.execCommand('copy')}} />
      </div>
    )
  }
}

export default CopyToClipboard