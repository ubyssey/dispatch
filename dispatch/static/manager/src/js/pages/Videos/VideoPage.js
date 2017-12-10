import React from 'react'

import VideoEditor from '../../components/VideoEditor'

export default function VideoPage(props) {
	return (
		<VideoEditor
		  itemId={props.params.videoId}
		  goBack={props.history.goBack}
		  route={props.route} />
	)
}