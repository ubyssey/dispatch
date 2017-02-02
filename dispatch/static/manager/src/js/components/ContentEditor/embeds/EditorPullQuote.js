var React = require('react');
var EditorPullQuote = React.createClass({
    getInitialState: function(){
        return {
            content: this.props.data.content,
            source: this.props.data.source
        };
    },
    updateContent: function(event){
        this.setState({ content: event.target.value });
    },
    updateSource: function(event){
        this.setState({ source: event.target.value });
    },
    getJSON: function(){
        return {
            type: 'quote',
            data: {
                content: this.state.content,
                source: this.state.source
            }
        }
    },
    render: function(){
        return (
            <div className="quote basic">
                <div className="header">
                    <div className="pull-left">
                        <h4>Pull Quote</h4>
                    </div>
                    <div className="pull-right">
                        <button onClick={this.props.remove}><i className="fa fa-trash-o"></i> Remove</button>
                    </div>
                </div>
                <div className="body">
                    <div className="field full">
                        <label>Content</label>
                        <textarea onChange={this.updateContent} value={this.state.content} />
                    </div>
                    <div className="field full">
                        <label>Source</label>
                        <input type="text" onChange={this.updateSource} value={this.state.source} />
                    </div>
                </div>
            </div>
        );
    }
});


var factory = function(options){
    return {
        controller: function(line, embed){
            return React.render(
                <EditorPullQuote data={embed.data} remove={line.remove} />,
                line.node
            );
        },
    }
}

module.exports = factory;