import { push } from 'react-router-redux'

import * as types from '../constants/ActionTypes'
import { videoSchema } from '../constants/Schemas'

import DispatchAPI from '../api/dispatch'

import { ResourceActions } from '../util/redux'

class VideoActions extends ResourceActions {

	search(query) {
		let queryObj = {}

		if (query) {
			queryObj.q = query
		}

		return dispatch => {
			dispatch(push({ pathname: '/videos/', query: queryObj }))
		}
	}

}

export default new VideosActions(
	types.VIDEOS,
	DispatchAPI.videos,
	videoSchema
)