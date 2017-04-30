import * as types from '../constants/ActionTypes'
import { tagSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

import { ResourceActions } from '../util/redux'

export default new ResourceActions(
  types.TAGS,
  DispatchAPI.tags,
  tagSchema
)
