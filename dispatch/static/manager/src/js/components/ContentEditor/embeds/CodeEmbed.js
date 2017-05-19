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

const DEFAULTVALUES = {
  html : '<div>Enter html code here</div>',
  css : '.cssCode{width:1px;}',
  javascript : 'function javascript(arguments){return true}'
}

class CodeEmbedComponent extends React.Component {

  constructor(props) {
    super(props)
    if(this.props.data.embedValue){
      this.state = {
        mode: this.props.data.mode,
        edit: false
      }
    }
    else{
      this.state = {
        mode: 'html',
        edit: true
      }
    }
  }

  onCodeChange(newValue) {
    this.props.data.embedValue = newValue
  }

  changeMode(mode) {
    this.setState({
      mode: mode
    })
    this.props.updateField('mode',this.state.mode)
  }

  previewCodeEmbed() {
    this.setState({
      edit: false
    })
  }

  startEditing() {
    this.setState({
      edit: true
    })
  }

  renderEditor() {
    return (
      <div className='o-embed--code'>
        <AceEditor
          mode={this.state.mode}
          theme='chrome'
          width='100%'
          height='300px'
          value={this.props.data.embedValue ? this.props.data.embedValue : DEFAULTVALUES[this.state.mode]}
          showPrintMargin={false}
          onChange={(value) => this.onCodeChange(value)}
          className='o-embed--code_editor'
          editorProps={{$blockScrolling: true}}
        />
        <div className='o-embed--code_editor_button_container'>
          <Button onClick={() => this.previewCodeEmbed()}>Preview</Button>
          <div className='o-embed--code_editor_mode_select'>
            <SelectInput
              options={MODES}
              selected={this.state.mode}
              onChange={(e) => this.changeMode(e.target.value)}
            />
          </div>
        </div>
      </div>
    )
  }

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
    console.log('props: ',this.props.data)
    return(
      <div className='o-embed o-embed--code'>
        {this.state.edit ? this.renderEditor() : this.renderEmbed()}
      </div>
    )
  }
}

export default {
  type: 'code',
  component: CodeEmbedComponent,
  defaultData: {
    embedValue: '',
    mode: ''
  }
}
