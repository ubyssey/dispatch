import { normalize } from 'normalizr'

import { ResourceActions, pending, fulfilled, rejected } from '../util/redux'

const PREVIEW_PREFIX = '_dispatch-preview'

function openPreviewWindow(url, id) {
  window.open(url, `${PREVIEW_PREFIX}-${id}`)
}

export default class PublishableActions extends ResourceActions {

  publish(token, id, data) {
    return (dispatch) => {

      dispatch({ type: pending(this.types.PUBLISH) })

      this.api.save(token, id, this.toRemote(data))
        .then(() => this.api.publish(token, id))
        .then(json => {
          dispatch({
            type: fulfilled(this.types.PUBLISH),
            payload: {
              data: normalize(
                this.fromRemote(json),
                this.schema
              )
            }
          })
        })
        .catch(error => {
          dispatch({
            type: rejected(this.types.PUBLISH),
            payload: error
          })
        })
    }
  }

  unpublish(token, id) {
    return {
      type: this.types.UNPUBLISH,
      payload: this.api.unpublish(token, id)
        .then(json => ({
          data: normalize(
            this.fromRemote(json),
            this.schema
          )
        }))
    }
  }

  preview(token, id, data) {
    return (dispatch) => {

      dispatch({ type: pending(this.types.SAVE) })

      this.api.save(token, id, this.toRemote(data))
        .then(json => {
          dispatch({
            type: fulfilled(this.types.SAVE),
            payload: {
              data: normalize(
                this.fromRemote(json),
                this.schema
              )
            }
          })
          openPreviewWindow(`${json.url}?version=${json.current_version}&preview_id=${json.preview_id}`, json.id)
        })
        .catch(error => {
          dispatch({
            type: rejected(this.types.SAVE),
            payload: error
          })
        })

    }
  }
}
