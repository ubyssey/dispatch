import * as types from '../constants/ActionTypes'
import { tagSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

import { ResourceActions } from '../util/redux'

export default ResourceActions(
  types.TAGS,
  DispatchAPI.tags,
  tagSchema
)
