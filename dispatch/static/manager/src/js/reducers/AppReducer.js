import { combineReducers } from 'redux'

import entitiesReducer from './EntitiesReducer'
import authReducer from './AuthReducer'
import sectionsReducer from './SectionsReducer'
import articlesReducer from './ArticlesReducer'
import imagesReducer from './ImagesReducer'
import personsReducer from './PersonsReducer'
import toasterReducer from './ToasterReducer'
import editorReducer from './EditorReducer'

export default combineReducers({
  entities: entitiesReducer,
  auth: authReducer,
  sections: sectionsReducer,
  articles: articlesReducer,
  images: imagesReducer,
  persons: personsReducer,
  toaster: toasterReducer,
  editor: editorReducer
})
