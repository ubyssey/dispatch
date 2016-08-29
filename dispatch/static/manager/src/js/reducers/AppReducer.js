import { combineReducers } from 'redux'

import authReducer from './AuthReducer'
import sectionsReducer from './SectionsReducer'

export default combineReducers({
  auth: authReducer,
  sections: sectionsReducer,
})
