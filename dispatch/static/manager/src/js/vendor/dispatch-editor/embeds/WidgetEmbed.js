import React from 'react'

import WidgetSelectInput from '../../../components/inputs/WidgetSelectInput'
import { FormInput } from '../../../components/inputs'

function WidgetEmbedComponent(props) {
  console.log(props)
  return (
    <div className='o-embed o-embed--widget'>
      <FormInput label='Widget'>
        <WidgetSelectInput
          zoneId='embed'
          selected={props.data.widget_id}
          update={widgetId => props.updateField('widget_id', widgetId)} />
      </FormInput>
    </div>
  )
}

export default {
  type: 'widget',
  component: WidgetEmbedComponent,
  defaultData: {
    widget_id: null,
    data: {}
  }
}
