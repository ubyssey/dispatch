import React from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'

import ItemIndexPage from '../ItemIndexPage'
import videosActions from '../../actions/VideosActions'
import { humanizeDatetime } from '../../util/helpers'
import { AuthorFilterInput, TagsFilterInput} from '../../components/inputs/filters'
import PersonsActions from '../../actions/PersonsActions';

const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token,
    listItems: state.app.videos.list,
    entities: {
      listItems: state.app.entities.videos,
      persons: state.app.entities.persons,
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listListItems: (token, query) => {
      if (props.entities.persons)
      dispatch(PersonsActions.list(token, query))
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
    searchVideos: (author, tags, query) => {
      dispatch(videosActions.search(author, tags, query))
    }
  }
}

const renderThumb = (url) => {
  return (
    <div className={'c-image-page-thumb'} style={{backgroundImage: `url(https://img.youtube.com/vi/${url.split('v=')[1]}/0.jpg)`}} />
  )
}

function VideosPageComponent(props) {
  
  const hasFilters = props.location.query.author || props.location.query.tags

  const filters = [
    <AuthorFilterInput
      key={'authorFilter'}
      value={props.location.query.author}
      update={(author) => props.searchVideos(author, props.location.query.tags, props.location.query.q)} />,
    <TagsFilterInput
      key={'tagsFilter'}
      value={props.location.query.tags}
      update={(tags) => props.searchVideos(props.location.query.author, tags, props.location.query.q)} />
  ]

  return (
    <ItemIndexPage
      pageTitle='Videos'  
      typePlural='videos'
      typeSingular='video'
      displayColumn='title'
      filters={filters}
      hasFilters={hasFilters}
      headers={[ 'Title', 'URL', 'Preview', 'Author', 'Created', 'Updated' ]}
      extraColumns={[
        item => item.url,
        item => (renderThumb(item.url)),
        item => (Object.keys(props.entities.persons).length != 0 && item.authors.length ? props.entities.persons[item.authors[0].person]['full_name']: ''),
        item => humanizeDatetime(item.created_at, true),
        item => humanizeDatetime(item.updated_at, true)
      ]}
      shouldReload={(prevProps) => {
        return (
          (prevProps.location.query.author !== props.location.query.author)  ||
          (prevProps.location.query.tags !== props.location.query.tags)
        )
      }}
      queryHandler={(query, props) => {
        if (props.location.query.author) {
          query.author = props.location.query.author
        }
        if (props.location.query.tags) {
          query.tags = props.location.query.tags
        }
        return query
      }}
      searchListItems={(query) => props.searchVideos(props.location.query.author, props.location.query.tags, query)}
      {... props} />
  )
}

const VideosIndexPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(VideosPageComponent)

export default VideosIndexPage
