import React from 'react'
import R from 'ramda'
import DocumentTitle from 'react-document-title'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router'
import { Button, Intent } from '@blueprintjs/core'

import { confirmNavigation } from '../../../util/helpers'

import podcastsActions from '../../../actions/PodcastsActions'
import podcastEpisodesActions from '../../../actions/PodcastEpisodesActions'
import PodcastEpisodeForm from './PodcastEpisodeForm'

import { Toolbar, ToolbarLeft, ToolbarRight } from '../../Toolbar'
import ConfirmButtom from '../../inputs/ConfirmButton'

const NEW_LISTITEM_ID = 'new'
const TYPE = 'Episode'
const TYPE_PLURAL = 'Episodes'

const mapStateToProps = (state) => {
  return {
    token: state.app.auth.token,
    listItem: state.app.podcastEpisodes.single,
    entities: {
      podcasts: state.app.entities.podcasts,
      remote: state.app.entities.podcastEpisodes,
      local: state.app.entities.local.podcastEpisodes,
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPodcast: (token, podcastId) => {
      dispatch(podcastsActions.get(token, podcastId))
    },
    getListItem: (token, podcastEpisodeId) => {
      dispatch(podcastEpisodesActions.get(token, podcastEpisodeId))
    },
    setListItem: (podcastEpisode) => {
      dispatch(podcastEpisodesActions.set(podcastEpisode))
    },
    saveListItem: (token, podcastEpisodeId, data) => {
      dispatch(podcastEpisodesActions.save(token, podcastEpisodeId, data))
    },
    createListItem: (token, data, listRoute) => {
      dispatch(podcastEpisodesActions.create(token, data, listRoute))
    },
    deleteListItem: (token, podcastEpisodeId, next) => {
      dispatch(podcastEpisodesActions.delete(token, podcastEpisodeId, next))
    }
  }
}

class PodcastEpisodeEditorComponent extends React.Component {
  componentDidMount() {
    this.props.getPodcast(this.props.token, this.props.podcastId)

    if (this.props.isNew) {
      // Create empty listItem
      this.props.setListItem({
        id: NEW_LISTITEM_ID,
        podcast_id: this.props.podcastId
      })
    } else {
      // Fetch listItem
      this.props.getListItem(this.props.token, this.props.episodeId)
    }

    if (this.props.route) {
      confirmNavigation(
        this.props.router,
        this.props.route,
        () => !this.props.listItem.isSaved
      )
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.isNew) {
      // Fetch listItem
      if (prevProps.episodeId !== this.props.episodeId) {
        this.props.getListItem(this.props.token, this.props.episodeId)
      }
    }
  }

  getListItem() {
    if (!this.props.entities.local) {
      // need to wait for GET call to complete
      return
    }

    if (this.props.isNew) {
      return this.props.entities.local[NEW_LISTITEM_ID]
    } else {
      return this.props.entities.local[this.props.episodeId] ||
        R.path(['entities','remote',this.props.episodeId], this.props) || false
    }
  }

  saveListItem(listRoute) {
    if (this.props.isNew) {
      this.props.createListItem(this.props.token, this.getListItem(), listRoute)
    } else {
      this.props.saveListItem(
        this.props.token,
        this.props.episodeId,
        this.getListItem()
      )
    }
  }

  handleUpdate(field, value) {
    this.props.setListItem(R.assoc(field, value, this.getListItem()))
  }

  handleBulkUpdate(data) {
    this.props.setListItem(R.merge(this.getListItem(), data))
  }

  render() {
    const podcast = R.path(['podcasts', this.props.podcastId], this.props.entities)
    const listItem = this.getListItem()

    if (!podcast || !listItem) {
      return (<div>Loading</div>)
    }

    const listRoute = `/podcasts/${podcast.id}/episodes`

    const title = this.props.isNew ? `New ${TYPE  }` : `Edit - ${listItem.title}`

    return (
      <DocumentTitle title={title}>
        <div className='u-container-main'>
          <Toolbar>
            <ToolbarLeft>
              <ul className='bp3-breadcrumbs'>
                <li><Link className='bp3-breadcrumb' to='/podcasts/'>Podcasts</Link></li>
                <li><Link className='bp3-breadcrumb' to={`/podcasts/${podcast.id}`}>{podcast.title}</Link></li>
                <li><Link className='bp3-breadcrumb' to={listRoute}>{TYPE_PLURAL}</Link></li>
                <li><span className='bp3-breadcrumb bp3-breadcrumb-current'>{this.props.isNew ? `New ${TYPE}` : listItem.title}</span></li>
              </ul>
            </ToolbarLeft>
            <ToolbarRight>
              <Button
                intent={Intent.SUCCESS}
                icon='tick'
                onClick={() => this.saveListItem(listRoute)}>{this.props.isNew ? 'Save' : 'Update'}</Button>
              <ConfirmButtom
                intent={Intent.DANGER}
                icon='trash'
                disabled={this.props.isNew}
                onConfirm={() => this.props.deleteListItem(this.props.token, this.props.episodeId, this.props.listRoute)}>Delete</ConfirmButtom>
            </ToolbarRight>
          </Toolbar>
          <div className='u-container u-container--padded u-container--vscroll'>
            <PodcastEpisodeForm
              listItem={listItem}
              errors={this.props.listItem ? this.props.listItem.errors : {}}
              update={(field, value) => this.handleUpdate(field, value)}
              bulkUpdate={(data) => this.handleBulkUpdate(data)}
              settings={this.props.settings ? this.props.settings : {}} />
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

const PodcastEpisodeEditor = connect(
  mapStateToProps,
  mapDispatchToProps
)(PodcastEpisodeEditorComponent)

export default withRouter(PodcastEpisodeEditor)
