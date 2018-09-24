import React from 'react'
import { connect } from 'react-redux'

import ItemSelectInput from './ItemSelectInput'

import podcastEpisodesActions from '../../../actions/PodcastEpisodesActions'

class PodcastEpisodeSelectInputComponent extends React.Component {

  listTags(query) {
    this.props.listPodcastEpisodes(this.props.token, { q: query })
  }

  render() {
    return (
      <ItemSelectInput
        value={this.props.value}
        results={this.props.podcastEpisodes.ids}
        entities={this.props.entities.podcastEpisodes}
        onChange={(value) => this.props.onChange(value)}
        fetchResults={(query) => this.listTags(query)}
        attribute='title'
        editMessage={Array.isArray(this.props.value) ? 'Edit podcasts' : 'Add podcast'} />
    )
  }

}

const mapStateToProps = (state) => {
  return {
    podcastEpisodes: state.app.podcastEpisodes.list,
    entities: {
      podcastEpisodes: state.app.entities.podcastEpisodes
    },
    token: state.app.auth.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    listPodcastEpisodes: (token, query) => {
      dispatch(podcastEpisodesActions.list(token, query))
    }
  }
}

const PodcastEpisodeSelectInput = connect(
  mapStateToProps,
  mapDispatchToProps
)(PodcastEpisodeSelectInputComponent)

export default PodcastEpisodeSelectInput
