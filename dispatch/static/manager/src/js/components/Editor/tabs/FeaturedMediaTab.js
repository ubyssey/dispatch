import React from 'react'

import FeaturedImageTab from './FeaturedImageTab'
import FeaturedVideoTab from './FeaturedVideoTab'

export default function FeaturedMediaTab(props) {

  function haveImage(props) {
    return props.article.featured_image && props.article.featured_image.image
  }

  function haveVideo(props) {
    return props.article.featured_video && props.article.featured_video.video
  }

  if (haveImage(props)) {
    return (
      <div className='c-article-sidebar__panel_v2_soon'>
        <FeaturedImageTab
          update={props.update}
          featured_image={props.article.featured_image}
          entities={props.entities} />
      </div>
    )
  } else if (haveVideo(props)) {
    return (
      <div className='c-article-sidebar__panel_v2_soon'>
        <FeaturedVideoTab
          update={props.update}
          featured_video={props.article.featured_video}
          entities={props.entities} />
      </div>
    )
  } else {
    return (
      <div className='c-article-sidebar__panel_v2_soon'>
        <FeaturedImageTab
          update={props.update}
          featured_image={props.article.featured_image}
          entities={props.entities} />
        <FeaturedVideoTab
          update={props.update}
          featured_video={props.article.featured_video}
          entities={props.entities} />
      </div>
    )
  }
}

