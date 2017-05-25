import * as types from '../constants/ActionTypes'
import { gallerySchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

import { ResourceActions } from '../util/redux'

export default new ResourceActions(
  types.GALLERIES,
  DispatchAPI.galleries,
  gallerySchema
)
