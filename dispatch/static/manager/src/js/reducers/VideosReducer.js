import { combineReducers } from 'redux'

import * as types from '../constants/ActionTypes'

import {
	buildManyResourceReducer,
	buildSingleResourceReducer
} from '../util/redux'


export default combineReducers({
	list: buildManyResourceReducer(types.VIDEOS).getReducer(),
	single: buildSingleResourceReducer(types.VIDEOS).getReducer(),
})