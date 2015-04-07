var EditorCode = React.createClass({
    getInitialState: function(){
        return {
            content: this.props.data.content ? this.props.data.content : '',
        };
    },
    handleContentChange: function(event){
        this.setState({
            content: event.target.value,
        });
    },
    getJSON: function(){
        return {
            type: 'code',
            data: {
                content: this.state.content,
            }
        }
    },
    render: function(){
        return (
            <div className="embed-code">
                <textarea placeholder="Write some code" onChange={this.handleContentChange}>{this.state.content}</textarea>
            </div>
            );
    }
});


var factory = {
    controller: function(node, embed){
        return React.render(
            <EditorCode data={embed.data} />,
            node
        );
    },
}

module.exports = factory;