import * as types from '../constants/ActionTypes'
import { personSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

import { ResourceActions } from '../util/redux'

export default new ResourceActions(
  types.PERSONS,
  DispatchAPI.persons,
  personSchema
)
