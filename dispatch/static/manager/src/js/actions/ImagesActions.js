import * as types from '../constants/ActionTypes'
import { imageSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

import GenericActions from './GenericActions'

export default new GenericActions(
  types.IMAGES,
  DispatchAPI.images,
  imageSchema
)
