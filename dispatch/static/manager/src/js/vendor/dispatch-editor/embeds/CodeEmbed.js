import React from 'react'
import AceEditor from 'react-ace'

import SelectInput from '../../../components/inputs/SelectInput'

import 'brace/mode/html'
import 'brace/mode/css'
import 'brace/mode/javascript'
import 'brace/theme/chrome'

require('../styles/embeds/code.scss')

const MODES = [
  { value: 'html', label: 'html' },
  { value: 'css', label:'css' },
  { value: 'javascript', label: 'javascript' }
]

function CodeEmbedComponent(props) {
  return(
    <div className='o-embed o-embed--code'>
      <AceEditor
        className='o-embed--code__editor'
        mode={props.data.mode}
        theme='chrome'
        width='100%'
        height='300px'
        value={props.data.content}
        showPrintMargin={false}
        onChange={(content) => props.updateField('content', content)}
        editorProps={{$blockScrolling: true}}
      />
      <div className='o-embed--code__footer'>
        <div className='o-embed--code__mode'>
          <SelectInput
            options={MODES}
            selected={props.data.mode}
            onChange={(e) => props.updateField('mode', e.target.value)}/>
        </div>
      </div>
    </div>
  )
}

export default {
  type: 'code',
  component: CodeEmbedComponent,
  defaultData: {
    content: '',
    mode: 'html',
  }
}
