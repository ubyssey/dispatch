import * as types from '../constants/ActionTypes'
import { inviteSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

import { ResourceActions } from '../util/redux'

export default new ResourceActions(
  types.INVITES,
  DispatchAPI.invites,
  inviteSchema
)
