import * as types from '../constants/ActionTypes'
import { topicSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

import { ResourceActions } from '../util/redux'

export default ResourceActions(
  types.TOPICS,
  DispatchAPI.topics,
  topicSchema
)
