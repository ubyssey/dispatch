import { normalize } from 'normalizr'

import GenericActions from './GenericActions'

export default class PublishableActions extends GenericActions {

  publish(token, id, data) {
    return (dispatch) => {

      dispatch({ type: `${this.types.PUBLISH}_PENDING` })

      this.api.save(token, id, this.prepareData(data))
        .then(() => this.api.publish(token, id))
        .then(json => {
          dispatch({
            type: `${this.types.PUBLISH}_FULFILLED`,
            payload: normalize(json, this.schema)
          })
        })
        .catch(error => {
          dispatch({
            type: `${this.types.PUBLISH}_REJECTED`,
            payload: error
          })
        })
    }
  }

  unpublish(token, id) {
    return {
      type: this.types.UNPUBLISH,
      payload: this.api.unpublish(token, id)
        .then(json => normalize(json, this.schema))
    }
  }

  preview(token, id, data) {
    return (dispatch) => {
      
      dispatch({ type: `${this.types.SAVE}_PENDING` })

      this.api.save(token, id, this.prepareData(data))
        .then(json => {
          dispatch({
            type: `${this.types.SAVE}_FULFILLED`,
            payload: normalize(json, this.schema)
          })

          window.open(json.url, `_dispatch-preview-${json.id}`)
        })
        .catch(error => {
          dispatch({
            type: `${this.types.SAVE}_REJECTED`,
            payload: error
          })
        })

    }
  }
}
