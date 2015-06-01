var React = require('react');
var EditorVideo = React.createClass({
    getInitialState: function(){
        return {
            validUrl: false,
            url: this.props.data.url ? this.props.data.url : "",
        };
    },
    validYT: function(url){
      var p = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?=.*v=((\w|-){11}))(?:\S+)?$/;
      return (url.match(p)) ? RegExp.$1 : false;
    },
    handleURLChange: function(event){
        event.preventDefault();
        valid = this.validYT(event.target.value);
        console.log(valid);
        this.setState({
            url: event.target.value,
            validUrl: false,
        });
    },
    getJSON: function(){
        return {
            type: 'youtube',
            data: {
                url: this.state.url,
            }
        }
    },
    renderInput: function(){
        return (
            <div>
                <input placeholder="Enter a YouTube video URL" value={this.state.url} onChange={this.handleURLChange} />
            </div>
            )
    },
    renderVideo: function(){
        return (
            <div>
                this is a video
            </div>
            )
    },
    render: function(){
        return (
            <div className="embed-video">
            { this.state.validUrl ? this.renderVideo() : this.renderInput() }
            </div>
            );
    }
});


var factory = function(options){
    return {
        controller: function(node, embed){
            return React.render(
                <EditorVideo data={embed.data} />,
                node
            );
        },
    }
}

module.exports = factory;