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
                <div className="header">
                    <div className="pull-left">
                        <h4>Inline Advertisement</h4>
                    </div>
                    <div className="pull-right">
                        <button onClick={this.props.remove}><i className="fa fa-trash-o"></i> Remove</button>
                    </div>
                </div>
                <div className="body">
                    <div className="field full">
                        <label>Type</label>
                        <select onChange={this.updateType} value={this.state.type}>
                            <option value="square">Square</option>
                        </select>
                    </div>
                    <div className="field full">
                        <label>Alignment</label>
                        <select onChange={this.updateAlignment} value={this.state.alignment}>
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                        </select>
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
                <EditorAdvertisement data={embed.data} remove={line.remove} />,
                line.node
            );
        },
    }
}

module.exports = factory;