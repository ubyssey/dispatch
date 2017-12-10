import React from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'

import ItemIndexPage from '../ItemIndexPage'
import videosActions from '../../actions/VideosActions'

const mapStateToProps = (state) => {
	return {
		token: state.app.auth.token,
		listItems: state.app.videos.list,
		entities: {
			listItems: state.app.entities.videos
		}
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		listListItems: (token, query) => {
			dispatch(videosActions.list(token, query))
		},
		toggleListItem: (videoId) => {
			dispatch(videosActions.toggle(videoId))
		},
		toggleAllListItems: (videoIds) => {
			dispatch(videosActions.toggleAll(videoIds))
		},
		clearSelectedListItems: () => {
			dispatch(videosActions.clearSelected())
		},
		clearListItems: () => {
			dispatch(videosActions.clearAll())
		},
		deleteListItems: (token, videoIds, goDownPage) => {
			dispatch(videosActions.deleteMany(token, videoIds))
			if (goDownPage) {
				dispatch(replace({
					pathname: '/videos/',
					query: {
						page: goDownPage
					}
				}))
			}
		},
		searchListItems: (query) => {
			dispatch(videosActions.search(query))
		}
	}
}

function VideosPageComponent(props) {
	return (
		<ItemIndexPage
		  typeSingular='video'
		  typePlural='videos'
		  displayColumn='title'
		  pageTitle='Videos'
		  headers={[ 'Title', 'URL' ]}
		  extraColumns={[
		  	item => item.url
		  ]}
		  {... props} />
	)
}

export VideosIndexPage = connect(
	mapStateToProps,
	mapDispatchToProps
)(VideosPageComponent)

export default VideosIndexPage