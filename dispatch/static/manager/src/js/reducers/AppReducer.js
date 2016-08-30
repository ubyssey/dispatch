import { combineReducers } from 'redux'

import authReducer from './AuthReducer'
import sectionsReducer from './SectionsReducer'
import articlesReducer from './ArticlesReducer'

export default combineReducers({
  auth: authReducer,
  sections: sectionsReducer,
  articles: articlesReducer
})
