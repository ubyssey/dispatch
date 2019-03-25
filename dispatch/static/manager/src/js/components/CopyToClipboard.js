import React from 'react'
import Tooltip from '../components/Tooltip'

require('../../styles/components/tooltip.scss')
require('../../styles/components/copy_to_clipboard.scss')

class CopyToClipboard extends React.Component {
  render() {
    return (
      <div className="c-copy-container">
        <textarea
          ref={(node) => { this.txtInput = node }}
          value={this.props.text} />
        <Tooltip text={'Copied!'} position={'top'} activateOnClick={true}>
          <button
            className="bp3-button bp3-icon-medium bp3-icon-clipboard"
            onClick={() => { this.txtInput.select(); document.execCommand('copy') }} />
        </Tooltip>
      </div>
    )
  }
}

export default CopyToClipboard