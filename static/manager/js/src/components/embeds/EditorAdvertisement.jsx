var React = require('react');
var EditorAdvertisement = React.createClass({
    getInitialState: function(){
        return {
            type: this.props.data.type,
            alignment: this.props.data.alignment
        };
    },
    updateType: function(event){
        this.setState({ type: event.target.value });
    },
    updateAlignment: function(event){
        this.setState({ alignment: event.target.value });
    },
    getJSON: function(){
        return {
            type: 'advertisement',
            data: {
                type: this.state.type,
                alignment: this.state.alignment
            }
        }
    },
    render: function(){
        return (
            <div className="advertisment basic">
                <div className="field full">
                    <label>Type</label>
                    <input type="text" onChange={this.updateType} value={this.state.type} />
                </div>
                <div className="field full">
                    <label>Alignment</label>
                    <input type="text" onChange={this.updateAlignment} value={this.state.alignment} />
                </div>
                <div className="pull-right">
                    <button onClick={this.props.remove}>Remove</button>
                </div>
            </div>
        );
    }
});


var factory = function(options){
    return {
        controller: function(line, embed){
            return React.render(
                <EditorAdvertisement data={embed.data} remove={line.remove} />,
                line.node
            );
        },
    }
}

module.exports = factory;