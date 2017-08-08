import React from 'react'

import WidgetSelectInput from '../../../components/inputs/WidgetSelectInput'
import { FormInput, TextInput } from '../../../components/inputs'

function WidgetEmbedComponent(props) {
  console.log(props)
  return (
    <div className='o-embed o-embed--widget'>

        <FormInput label='Content'>

          <TextInput
            fill={true}
            value={props.data.content}
            onChange={e => props.updateField('content', e.target.value)} />

        </FormInput>

        <FormInput>
          <WidgetSelectInput
            zoneId={props.data.zoneId}
            selected={props.data.zone.widget}
            update={widgetId => props.updateField('widget', widgetId)} />

        </FormInput>

    </div>
  )
}

export default {
  type: 'widget',
  component: WidgetEmbedComponent,
  defaultData: {
    zoneId: 'embed',
    zone: {
      widget: 'upcoming-events'
    }
  }
}
