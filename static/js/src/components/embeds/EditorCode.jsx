var React = require('react');
var ace = require('brace');

require('brace/mode/python');
require('brace/mode/javascript');
require('brace/mode/html');
require('brace/mode/css');
require('brace/theme/chrome');

var EditorCode = React.createClass({
    componentDidMount: function(){
        this.editor = ace.edit(React.findDOMNode(this.refs.codeEditor));
        this.changeMode(this.props.data.mode ? this.props.data.mode : "javascript");
        this.editor.setTheme('ace/theme/chrome');
        this.editor.$blockScrolling = Infinity;
        this.editor.setOptions({ maxLines: 100 });
        this.editor.setValue(this.props.data.content);
    },
    getJSON: function(){
        return {
            type: 'code',
            data: {
                mode: this.mode,
                content: this.editor.getValue()
            }
        }
    },
    changeMode: function(mode){
        this.mode = mode;
        this.editor.getSession().setMode('ace/mode/' + this.mode);
    },
    render: function(){
        return (
            <div>
                <div className="code-editor-wrapper">
                    <div className="code-editor" ref="codeEditor" ></div>
                </div>
                <div className="meta">
                    <ul className="controls">
                        <li onClick={this.changeMode.bind(this, 'html')}>HTML</li>
                        <li onClick={this.changeMode.bind(this, 'css')}>CSS</li>
                        <li onClick={this.changeMode.bind(this, 'python')}>Python</li>
                        <li onClick={this.changeMode.bind(this, 'javascript')}>Javascript</li>
                        <li onClick={this.props.remove}>Remove</li>
                    </ul>
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