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

class CodeEmbedComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      mode: 'html'
    }
  }

  onCodeChange(newValue) {
    this.props.data.embedValue = newValue
  }

  changeMode(mode) {
    this.setState({
      mode: mode
    })
  }


  render() {
    return (
      <div className='o-embed--code'>
        <AceEditor
          mode={this.state.mode}
          theme='chrome'
          width='100%'
          height='300px'
          value={this.props.data.embedValue}
          defaultValue='<h1>Enter html code here</h1>'
          showPrintMargin={false}
          onChange={(value) => this.onCodeChange(value)}
          className='o-embed--code_editor'
          editorProps={{$blockScrolling: true}}
        />
        <div className='o-embed--code_editor_button_container'>
          <Button>Insert</Button>
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
}

export default {
  type: 'code',
  component: CodeEmbedComponent,
  defaultData: {
    embedValue: ''
  }
}
