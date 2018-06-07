import React from 'react'
import R from 'ramda'

import WidgetSelectInput from '../../../components/inputs/selects/WidgetSelectInput'
import { FormInput } from '../../../components/inputs'
import WidgetFields from '../../../components/WidgetFields'

function WidgetEmbedComponent(props) {

  function updateWidgetField(fieldName, fieldValue) {
    props.updateField('data', R.assoc(fieldName, fieldValue, props.data.data))
    props.stopEditing()
  }

  return (
    <div className='o-embed o-embed--widget'>
      <form>
        <FormInput label='Widget'>
          <WidgetSelectInput
            zoneId='embed'
            selected={props.data.widget_id}
            update={widgetId => {
              props.updateField('widget_id', widgetId)
              props.stopEditing()
            }} />
        </FormInput>

        <FormInput label='Fields'>
          <WidgetFields
            updateField={updateWidgetField}
            widgetId={props.data.widget_id}
            data={props.data.data} />
        </FormInput>
      </form>
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
