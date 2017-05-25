import * as types from '../constants/ActionTypes'
import { imageSchema } from '../constants/Schemas'
import DispatchAPI from '../api/dispatch'

import { ResourceActions } from '../util/redux'

class ImagesActions extends ResourceActions {

  prepareData(data) {
    
    data.author_ids = data.authors

    return data
  }

}

export default new ImagesActions(
  types.IMAGES,
  DispatchAPI.images,
  imageSchema
)
