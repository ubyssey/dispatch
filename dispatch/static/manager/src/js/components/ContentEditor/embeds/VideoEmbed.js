import React from 'react'

import { FormInput, TextInput } from '../../inputs'

class VideoEmbedComponent extends React.Component {

  constructor(props){
    super(props)

    this.handleUrlChange = this.handleUrlChange.bind(this)
    this.insertVideo = this.insertVideo.bind(this)

    this.state = {
      inserted: false,
      validURL: false
    }
  }

  handleUrlChange(e){
    e.preventDefault()
    this.props.updateField('url', e.target.value)
    console.log("URL IS: "+this.props.data.url);

  }


  insertVideo(){
    var id = this.validYouTube(this.props.data.url);
    this.props.updateField('id',id)
    console.log("ID IS: "+this.props.data.id)

    if(this.props.data.id){
      this.setState({
        validURL: true,
        inserted : true
      })
    }
  }

  validYouTube(url){
     var p = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?=.*v=((\w|-){11}))(?:\S+)?$/
     return (url.match(p)) ? RegExp.$1 : false
  }


  renderInput(){
    return(
      <div>
        <form>
          <FormInput label='URL'>
            <TextInput
              fill={true}
              value={this.props.data.url}
              onChange={this.handleUrlChange} />
          </FormInput>
        </form>
        <button className="c-input--button"  onClick={this.insertVideo}>Insert</button>
      </div>

    )

  }
  renderVideo(){
    return(
      <div>
        <img className='o-embed--image__image'src={"http://img.youtube.com/vi/" + this.props.data.id + "/0.jpg"}/>
        <form>
          <FormInput label='URL'>
            <TextInput
              fill={true}
              value={this.props.data.url}
              onChange={this.handleUrlChange} />
          </FormInput>
        </form>
      </div>

    )
  }


  render(){

    return(
      <div className='o-embed o-embed--image'>
        {this.state.inserted ? this.renderVideo() : this.renderInput()}
      </div>
    )

  }
}

export default {
  type: 'Video',
  component: VideoEmbedComponent
}
