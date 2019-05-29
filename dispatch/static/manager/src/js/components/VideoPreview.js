import React from 'react'
import YouTube from 'react-youtube'

export default function VideoPreview(props) {

  function haveVideo(props) {
    if (props.videos && props.value) {
      let vid = props.videos[props.value]
      return props.value !== null &&
             vid !== undefined &&
             vid.url !== ''
    }
    return false
  }

  function getVidId(props) {
    let vid = props.videos[props.value]
    return new URL(vid.url).searchParams.get('v')
  }

  function _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo()
  }

  if (haveVideo(props)) {
    const opts = {
      height: props.height,
      width: props.width,
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 0
      }
    }

    return (
      <div className='c-article-sidebar__video-preview'>
        <YouTube
          videoId={getVidId(props)}
          opts={opts}
          onReady={_onReady} />
      </div>
    )
  } else {
    return null
  }
}

