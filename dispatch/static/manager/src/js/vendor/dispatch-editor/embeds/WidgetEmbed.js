import React from 'react'
import R from 'ramda'

import WidgetSelectInput from '../../../components/inputs/selects/WidgetSelectInput'
import WidgetFields from '../../../components/WidgetFields'

import * as Form from '../../../components/Form'

function WidgetEmbedComponent(props) {

  function updateWidgetField(fieldName, fieldValue) {
    props.updateField('data', R.assoc(fieldName, fieldValue, props.data.data))
    props.stopEditing()
  }

  return (
    <div className='o-embed o-embed--widget'>
      <Form.Container>
        <Form.Input label='Widget'>
          <WidgetSelectInput
            zoneId='embed'
            selected={props.data.widget_id}
            update={widgetId => {
              props.updateField('widget_id', widgetId)
              props.stopEditing()
            }} />
        </Form.Input>
        <Form.Input label='Fields'>
          <WidgetFields
            updateField={updateWidgetField}
            widgetId={props.data.widget_id}
            data={props.data.data} />
        </Form.Input>
      </Form.Container>
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
