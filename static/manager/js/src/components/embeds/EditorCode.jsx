var React = require('react');
var ace = require('brace');

require('brace/mode/python');
require('brace/mode/javascript');
require('brace/mode/html');
require('brace/mode/css');
require('brace/theme/chrome');

var EditorCode = React.createClass({
    getInitialState: function(){
        return {
            mode: this.props.data.mode ? this.props.data.mode : "javascript"
        };
    },
    componentDidMount: function(){
        this.editor = ace.edit(React.findDOMNode(this.refs.codeEditor));
        this.changeMode(this.state.mode);
        this.editor.setTheme('ace/theme/chrome');
        this.editor.$blockScrolling = Infinity;
        this.editor.setOptions({ maxLines: 100 });
        this.editor.setValue(this.props.data.content);
    },
    getJSON: function(){
        return {
            type: 'code',
            data: {
                mode: this.state.mode,
                content: this.editor.getValue()
            }
        }
    },
    updateMode: function(event){
        this.setState({ mode: event.target.value });
        this.changeMode();
    },
    changeMode: function(){
        this.editor.getSession().setMode('ace/mode/' + this.state.mode);
    },
    render: function(){
        return (
            <div className="code basic">
                <div className="header">
                    <div className="pull-left">
                        <h4>Code Snippet</h4>
                    </div>
                    <div className="pull-right">
                        <button onClick={this.props.remove}><i className="fa fa-trash-o"></i> Remove</button>
                    </div>
                </div>
                <div className="body">
                    <div className="field full">
                        <div className="code-editor" ref="codeEditor"></div>
                    </div>
                    <div className="field full">
                        <label>Mode</label>
                        <select onChange={this.updateMode} value={this.state.mode}>
                            <option value="javascript">Javascript</option>
                            <option value="html">HTML</option>
                            <option value="css">CSS</option>
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
                <EditorCode data={embed.data} remove={line.remove} />,
                line.node
            );
        },
    }
}

module.exports = factory;