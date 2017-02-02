var React = require('react');
var Textarea = require('react-textarea-autosize');

var EditorVideo = React.createClass({
    getInitialState: function(){
        return {
            validUrl: false,
            id: this.props.data.id,
            url: this.props.data.url ? this.props.data.url : "",
            inserted: this.props.data.url ? true : false,
            validUrl: this.props.data.url ? true : false,
            title: this.props.data.title,
            caption: this.props.data.caption,
            credit: this.props.data.credit
        };
    },
    validYT: function(url){
      var p = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?=.*v=((\w|-){11}))(?:\S+)?$/;
      return (url.match(p)) ? RegExp.$1 : false;
    },
    handleURLChange: function(event){
        event.preventDefault();
        var id = this.validYT(event.target.value);
        this.setState({
            url: event.target.value,
            id: id,
            validUrl: id ? true : false
        });
    },
    insertVideo: function(){
        this.setState({ inserted: true });
    },
    removeVideo: function(event){
        event.preventDefault();
        this.props.remove();
    },
    startEditing: function(){
        this.setState({ inserted: false });
    },
    updateTitle: function(event){
        this.setState({ title: event.target.value });
    },
    updateCaption: function(event){
        this.setState({ caption: event.target.value });
    },
    updateCredit: function(event){
        this.setState({ credit: event.target.value });
    },
    getJSON: function(){
        return {
            type: 'video',
            data: {
                source: 'youtube',
                id: this.state.id,
                url: this.state.url,
                title: this.state.title,
                caption: this.state.caption,
                credit: this.state.credit
            }
        }
    },
    renderInput: function(){
        return (
            <div className="insert-video">
                <div className="left">
                    <input placeholder="Enter a YouTube video URL" value={this.state.url} onChange={this.handleURLChange} />
                </div><div className="right">
                    <button className="dis-button green" disabled={!this.state.validUrl} onClick={this.insertVideo}>Insert</button>
                    <button className="dis-button" onClick={this.removeVideo}>Cancel</button>
                </div>
            </div>
            )
    },
    renderVideo: function(){
        return (
            <div className="video basic">
                <div className="header overlay">
                    <div className="pull-left">
                        <h4>Video</h4>
                    </div>
                    <div className="pull-right">
                        <button onClick={this.removeVideo}><i className="fa fa-trash-o"></i> Remove</button>
                    </div>
                </div>
                <div className="image">
                    <img src={"http://img.youtube.com/vi/" + this.state.id + "/0.jpg"} />
                </div>
                <div className="body">
                    <div className="field full">
                        <label>Title</label>
                        <input type="text" onChange={this.updateTitle} value={this.state.title} />
                    </div>
                    <div className="field full">
                        <label>Caption</label>
                        <Textarea rows={1} placeholder="Write a caption" onChange={this.updateCaption} value={this.state.caption} />
                    </div>
                    <div className="field full">
                        <label>Credit</label>
                        <input type="text" onChange={this.updateCredit} value={this.state.credit} />
                    </div>
                </div>
            </div>
            );
    },
    render: function(){
        return (<div className="embed-video">{ this.state.inserted ? this.renderVideo() : this.renderInput() }</div>);
    }
});


var factory = function(options){
    return {
        controller: function(line, embed){
            return React.render(
                <EditorVideo data={embed.data} remove={line.remove} />,
                line.node
            );
        },
    }
}

module.exports = factory;