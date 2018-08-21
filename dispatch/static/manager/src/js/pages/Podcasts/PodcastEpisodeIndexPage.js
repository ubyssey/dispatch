import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { replace } from 'react-router-redux'
import DocumentTitle from 'react-document-title'
import { Intent } from '@blueprintjs/core'
import { humanizeDatetime } from  '../../util/helpers'

import { Toolbar, ToolbarLeft, ToolbarRight } from '../../components/Toolbar'
import ItemList from '../../components/ItemList'
import { LinkButton } from '../../components/inputs'

import podcastsActions from '../../actions/PodcastsActions'
import podcastEpisodesActions from '../../actions/PodcastEpisodesActions'

const DEFAULT_LIMIT = 15

const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token,
    episodes: state.app.podcastEpisodes.list,
    entities: {
      podcasts: state.app.entities.podcasts,
      episodes: state.app.entities.podcastEpisodes
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPodcast: (token, podcastId) => {
      dispatch(podcastsActions.get(token, podcastId))
    },
    listListItems: (token, query) => {
      dispatch(podcastEpisodesActions.list(token, query))
    },
    toggleListItem: (podcastId) => {
      dispatch(podcastEpisodesActions.toggle(podcastId))
    },
    toggleAllListItems: (podcastIds) => {
      dispatch(podcastEpisodesActions.toggleAll(podcastIds))
    },
    clearSelectedListItems: () => {
      dispatch(podcastEpisodesActions.clearSelected())
    },
    clearListItems: () => {
      dispatch(podcastEpisodesActions.clearAll())
    },
    deleteListItems: (token, podcastIds, goDownPage) => {
      dispatch(podcastEpisodesActions.deleteMany(token, podcastIds))
      if (goDownPage) {
        dispatch(replace({
          pathname: '/podcasts/',
          query: {
            page: goDownPage
          }
        }))
      }
    },
    searchListItems: (query, podcastId) => {
      dispatch(podcastEpisodesActions.search(query, podcastId))
    }
  }
}

class PodcastEpisodesPageComponent extends React.Component {

  getQuery() {
    var query = {
      limit: DEFAULT_LIMIT,
      offset: (this.getCurrentPage() - 1) * DEFAULT_LIMIT
    }

    // If listItem is present, add to query
    if (this.props.location.query.listItem) {
      query.listItem = this.props.location.query.listItem
    }

    // If search query is present, add to query
    if (this.props.location.query.q) {
      query.q = this.props.location.query.q
    }

    return query
  }

  getCurrentPage() {
    return parseInt(this.props.location.query.page, 10) || 1
  }

  getTotalListItems() {
    return Math.ceil(
      parseInt(this.props.episodes.count, 10) / DEFAULT_LIMIT
    )
  }

  componentWillMount() {
    // Fetch podcast
    this.props.getPodcast(this.props.token, this.props.params.podcastId)

    // Fetch listItems
    this.props.clearListItems()
    this.props.clearSelectedListItems()
    this.props.listListItems(this.props.token, this.getQuery())
  }

  componentDidUpdate(prevProps) {
    if (this.isNewQuery(prevProps, this.props)) {
      this.props.clearListItems()
      this.props.clearSelectedListItems()
      this.props.listListItems(this.props.token, this.getQuery())
    } else if (this.isNewPage(prevProps, this.props)) {
      // Fetch listItems
      this.props.listListItems(this.props.token, this.getQuery())
      this.props.clearSelectedListItems()
    }
  }

  isNewQuery(prevProps, props) {
    return prevProps.location.query.q !== props.location.query.q
  }

  isNewPage(prevProps, props) {
    // Returns true if page number has changed
    return prevProps.location.query.page !== props.location.query.page
  }

  deleteListItems(listItemIds) {
    let page = this.getCurrentPage()
    if (listItemIds.length == this.props.episodes.ids.length
      && page) {
      page -= 1
    } else {
      page = null // don't change the page
    }
    this.props.deleteListItems(this.props.token, listItemIds, page)
    this.props.clearSelectedListItems()
  }

  render() {
    const podcast = R.path(['podcasts', this.props.params.podcastId], this.props.entities)

    if (!podcast) {
      return (<div>loading</div>)
    }

    const columns = [
      item => (
        <strong>
          <Link
            to={`/podcasts/${podcast.id}/episodes/${item.id}/`}
            dangerouslySetInnerHTML={{ __html: item.title }} />
        </strong>
      ),
      item => humanizeDatetime(item.published_at)
    ]

    return (
      <DocumentTitle title={`${podcast.title} - Episodes`}>
        <div>
          <Toolbar>
            <ToolbarLeft>
              <ul className='bp3-breadcrumbs'>
                <li><Link
                  className='bp3-breadcrumb'
                  to='/podcasts/'>Podcasts</Link></li>
                <li><Link
                  className='bp3-breadcrumb'
                  to={`podcasts/${podcast.id}/`}>{podcast.title}</Link></li>
                <li><span className='bp3-breadcrumb bp3-breadcrumb-current'>Episodes</span></li>
              </ul>
            </ToolbarLeft>
            <ToolbarRight>
              <LinkButton
                minimal={true}
                icon='edit'
                to={`podcasts/${podcast.id}/`}>Edit Podcast</LinkButton>
            </ToolbarRight>
          </Toolbar>
          <ItemList
            location={this.props.location}

            typeSingular='episode'
            typePlural='episodes'

            currentPage={this.getCurrentPage()}
            totalPages={this.getTotalListItems()}

            items={this.props.episodes}
            entities={this.props.entities.episodes}

            columns={columns}
            headers={['Title', 'Published At']}

            emptyMessage={'You haven\'t created any episodes yet.'}

            createHandler={() => (
              <LinkButton
                intent={Intent.SUCCESS}
                icon='add'
                to={`podcasts/${podcast.id}/episodes/new`}>
                Create episode
              </LinkButton>)
            }

            actions={{
              toggleItem: this.props.toggleListItem,
              toggleAllItems: this.props.toggleAllListItems,
              deleteItems: (listItemIds) => this.deleteListItems(listItemIds),
              searchItems: (query) => this.props.searchListItems(query, podcast.id)
            }} />
        </div>
      </DocumentTitle>
    )
  }
}

const PodcastEpisodesIndexPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(PodcastEpisodesPageComponent)

export default PodcastEpisodesIndexPage
