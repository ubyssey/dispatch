import * as types from '../constants/ActionTypes'

import { buildManyResourceReducer } from '../util/redux'

export default buildManyResourceReducer(types.TOPICS).getReducer()
