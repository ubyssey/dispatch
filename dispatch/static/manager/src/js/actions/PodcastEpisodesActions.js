import R from 'ramda'
import { push, replace } from 'react-router-redux'
import { normalize } from 'normalizr'

import { ResourceActions, pending, fulfilled, rejected } from '../util/redux'
import * as types from '../constants/ActionTypes'
import { podcastEpisodeSchema } from '../constants/Schemas'

import DispatchAPI from '../api/dispatch'
import { putFile } from '../api/upload'

class PodcastsActions extends ResourceActions {

  toRemote(data) {
    data = R.clone(data)

    data.image_id = data.image

    delete data.file_obj
    delete data.file_url
    delete data.file_upload_url

    return data
  }

  search(query, podcastId) {
    let queryObj = {}

    if (query) {
      queryObj.q = query
    }

    return dispatch => {
      dispatch(push({ pathname: `/podcasts/${podcastId}/episodes/`, query: queryObj }))
    }
  }

  save(token, id, data) {
    const file = data.file_obj

    return (dispatch) => {

      dispatch({ type: pending(this.types.SAVE) })

      this.api.save(token, id, this.toRemote(data))
        .then(json => {
          if (file) {
            const url = json.file_upload_url
            const contentType = json.type

            putFile(url, contentType, file)
              .then(() => {
                dispatch({
                  type: fulfilled(this.types.SAVE),
                  payload: {
                    data: normalize(
                      this.fromRemote(json),
                      this.schema
                    )
                  }
                })
              })
              .catch(() => {
                dispatch({
                  type: rejected(this.types.SAVE),
                  payload: { file: 'Audio file could not be uploaded' }
                })
              })
          } else {
            dispatch({
              type: fulfilled(this.types.SAVE),
              payload: {
                data: normalize(
                  this.fromRemote(json),
                  this.schema
                )
              }
            })
          }
        })
        .catch(error => {
          dispatch({
            type: rejected(this.types.SAVE),
            payload: error
          })
        })
    }
  }

  create(token, data, next=null, callback) {
    const file = data.file_obj

    return (dispatch) => {

      dispatch({ type: pending(this.types.CREATE) })

      this.api.create(token, this.toRemote(data))
        .then(json => {
          if (next) {
            dispatch(replace({
              pathname: `${next}/${json.id}`,
              state: { ignoreLeaveHook: true }
            }))
          }

          if (file) {
            const url = json.file_upload_url
            const contentType = json.type

            putFile(url, contentType, file)
              .then(() => {
                dispatch({
                  type: fulfilled(this.types.CREATE),
                  payload: {
                    data: normalize(
                      this.fromRemote(json),
                      this.schema
                    )
                  }
                })

                if (typeof callback === 'function') {
                  callback(json)
                }
              })
              .catch(() => {
                dispatch({
                  type: rejected(this.types.CREATE),
                  payload: { file: 'Audio file could not be uploaded' }
                })
              })
          } else {
            dispatch({
              type: fulfilled(this.types.CREATE),
              payload: {
                data: normalize(
                  this.fromRemote(json),
                  this.schema
                )
              }
            })

            if (typeof callback === 'function') {
              callback(json)
            }
          }
        })
        .catch(error => {
          dispatch({
            type: rejected(this.types.CREATE),
            payload: error
          })
        })
    }
  }

}

export default new PodcastsActions(
  types.PODCAST_EPISODES,
  DispatchAPI.podcasts.episodes,
  podcastEpisodeSchema
)
