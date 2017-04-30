import * as types from '../constants/ActionTypes'
import { personSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

export default ResourceActions(
  types.PERSONS,
  DispatchAPI.persons,
  personSchema
)
