import * as types from '../constants/ActionTypes'
import { templateSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

import { ResourceActions } from '../util/redux'

export default new ResourceActions(
  types.TEMPLATES,
  DispatchAPI.templates,
  templateSchema
)
