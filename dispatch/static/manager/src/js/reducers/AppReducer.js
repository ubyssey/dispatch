import { combineReducers } from 'redux'

import entitiesReducer from './EntitiesReducer'
import authReducer from './AuthReducer'
import sectionsReducer from './SectionsReducer'
import articlesReducer from './ArticlesReducer'
import filesReducer from './FilesReducer'
import imagesReducer from './ImagesReducer'
import templatesReducer from './TemplatesReducer'
import personsReducer from './PersonsReducer'
import topicsReducer from './TopicsReducer'
import tagsReducer from './TagsReducer'
import toasterReducer from './ToasterReducer'
import editorReducer from './EditorReducer'
import integrationsReducer from './IntegrationsReducer'
import dashboardReducer from './DashboardReducer'

export default combineReducers({
  entities: entitiesReducer,
  auth: authReducer,
  sections: sectionsReducer,
  articles: articlesReducer,
  files: filesReducer,
  images: imagesReducer,
  templates: templatesReducer,
  persons: personsReducer,
  topics: topicsReducer,
  tags: tagsReducer,
  toaster: toasterReducer,
  editor: editorReducer,
  integrations: integrationsReducer,
  dashboard: dashboardReducer
})
