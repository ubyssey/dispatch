import { normalize } from 'normalizr'

import { ResourceActions, pending, fulfilled, rejected } from '../util/redux'

export default class PublishableActions extends ResourceActions {

  publish(token, id, data) {
    return (dispatch) => {

      dispatch({ type: pending(this.types.PUBLISH) })

      this.api.save(token, id, this.prepareData(data))
        .then(() => this.api.publish(token, id))
        .then(json => {
          dispatch({
            type: fulfilled(this.types.PUBLISH),
            payload: {
              data: normalize(json, this.schema)
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
          data: normalize(json, this.schema)
        }))
    }
  }

  preview(token, id, data) {
    return (dispatch) => {

      dispatch({ type: pending(this.types.SAVE) })

      this.api.save(token, id, this.prepareData(data))
        .then(json => {
          dispatch({
            type: fulfilled(this.types.SAVE),
            payload: {
              data: normalize(json, this.schema)
            }
          })

          window.open(json.url, `_dispatch-preview-${json.id}`)
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
