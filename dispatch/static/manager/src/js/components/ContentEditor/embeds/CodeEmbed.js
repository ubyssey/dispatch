import React from 'react'

import AceEditor from 'react-ace'
import { Button } from '@blueprintjs/core'
import SelectInput from '../../inputs/SelectInput'

import 'brace/mode/html'
import 'brace/mode/css'
import 'brace/mode/javascript'
import 'brace/theme/chrome'

require('../../../../styles/components/embeds/code.scss')

const MODES = [
  { value: 'html', label: 'html' },
  { value: 'css', label:'css' },
  { value: 'javascript', label: 'javascript' }
]

const DEFAULTVALUE = '<div>Enter html code here</div>'

class CodeEmbedComponent extends React.Component {

  onCodeChange(newValue) {
    this.props.updateField('embedValue', newValue)
  }

  changeMode(mode) {
    this.props.updateField('mode',mode)
  }

  render() {
    return(
      <div className='o-embed o-embed--code'>
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
          <div className='o-embed--code_editor_mode_select'>
            <SelectInput
              options={MODES}
              selected={this.props.data.mode}
              onChange={(e) => this.changeMode(e.target.value)}/>
          </div>
        </div>
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
