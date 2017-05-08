import * as types from '../constants/ActionTypes'
import { imageSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

import { ResourceActions } from '../util/redux'

export default new ResourceActions(
  types.IMAGES,
  DispatchAPI.images,
  imageSchema
)
