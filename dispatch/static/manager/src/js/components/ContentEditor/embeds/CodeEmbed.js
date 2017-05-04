import React from 'react'

import AceEditor from 'react-ace'
import { Button } from '@blueprintjs/core'

import 'brace/mode/html'
import 'brace/theme/chrome'


require('../../../../styles/components/embeds/code.scss')

class CodeEmbedComponent extends React.Component {

  constructor(props){
    super(props)
  }
  onCodeChange(newValue){
    console.log('props are: ',this.props)

    this.props.data.embedValue = newValue

  }

  render(){
    return (
      <div className='o-embed--code'>
        <AceEditor
          mode='html'
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
