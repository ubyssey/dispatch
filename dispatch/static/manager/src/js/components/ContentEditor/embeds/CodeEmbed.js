import React from 'react'

import AceEditor from 'react-ace'
import { Button } from '@blueprintjs/core'
import SelectInput from '../../inputs/SelectInput'

import 'brace/mode/html'
import 'brace/theme/chrome'


require('../../../../styles/components/embeds/code.scss')

const MODES = [
  { value: 'html', label: 'html' },
  { value: 'css', label:'css' },
  { value: 'javascript', label: 'javascript' }
]

const DEFAULTVALUE = '<div>Enter html code here</div>'

class CodeEmbedComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showEdit: true
    }
  }

  onCodeChange(newValue) {
    this.props.updateField('embedValue', newValue)
  }

  changeMode(mode) {
    this.props.updateField('mode',mode)
  }

  previewCodeEmbed() {
    this.setState({
      showEdit: false
    })
  }

  startEditing() {
    this.setState({
      showEdit: true
    })
  }

  showPreviewButton() {
    return (
      <Button onClick={() => this.previewCodeEmbed()}>Preview</Button>
    )
  }

  renderEditor() {
    return (
      <div className='o-embed--code'>
        <AceEditor
          mode={this.props.data.mode}
          theme='chrome'
          width='100%'
          height='300px'
          value={this.props.data.embedValue}
          defaultValue={this.props.data.embedValue ? this.props.data.embedValue : DEFAULTVALUE}
          showPrintMargin={false}
          onChange={(e) => this.onCodeChange(e)}
          className='o-embed--code_editor'
          editorProps={{$blockScrolling: true}}
        />
        <div className='o-embed--code_editor_button_container'>
          {(this.props.data.mode === 'html') && this.showPreviewButton()}
          <div className='o-embed--code_editor_mode_select'>
            <SelectInput
              options={MODES}
              selected={this.props.data.mode}
              onChange={(e) => this.changeMode(e.target.value)}
            />
          </div>
        </div>
      </div>
    )
  }

//TODO:Add article styling to this div so that preview is representative of the actual article
  renderEmbed() {
    return (
      <div>
        <div
          dangerouslySetInnerHTML={{__html: this.props.data.embedValue}}>
        </div>
        <div className='o-embed--code_editor_button_container'>
          <Button onClick={() => this.startEditing()}>Edit</Button>
        </div>
      </div>
    )
  }
  render() {
    return(
      <div className='o-embed o-embed--code'>
        {this.state.showEdit ? this.renderEditor() : this.renderEmbed()}
      </div>
    )
  }
}

export default {
  type: 'code',
  component: CodeEmbedComponent,
  defaultData: {
    embedValue: '',
    mode: 'html',
  }
}
