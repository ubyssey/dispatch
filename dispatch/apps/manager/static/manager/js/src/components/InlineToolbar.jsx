var React = require('react');

var InlineToolbar = React.createClass({
    getInitialState: function(){
        return {
            showToolbar: false,
            showEmbeds: false,
            offset: 0,
        }
    },
    componentDidMount: function(){
        this.props.quill.on('text-change', function (delta, source) {
            this.triggerToolbar();
        }.bind(this));

        this.props.quill.on('selection-change', function(range) {
            this.triggerToolbar();
        }.bind(this));

        this.embeds = this.prepareEmbeds();
    },
    addEmbed: function(type, data) {
        this.props.quill.insertEmbed(type, data, this.lastIndex);
        this.closeToolbar();
    },
    triggerToolbar: function(){
        var range = this.props.quill.getSelection();

        if(range == null || range.start != range.end)
            return false

        var curLine = this.props.quill.editor.doc.findLineAt(range.start);

        var lineData = curLine[0];

        if(curLine[0]['length'] == 1 && lineData.node.nodeName != 'LI'){
            var id = lineData.id;
            var offset = document.getElementById(id).getBoundingClientRect().top - document.getElementById('article-editor').getBoundingClientRect().top;

            this.lastIndex = range.start;

            this.setState({
                showToolbar: true,
                showEmbeds: false,
                offset: offset,
            });
        } else {
            this.closeToolbar();
        }
    },
    triggerEmbed: function(item){
        if (typeof item.trigger !== 'undefined'){
            item.trigger(function(data){
                if (typeof data === 'undefined')
                    data = {}
                this.addEmbed(item.key, data);
            }.bind(this));
        } else {
            this.addEmbed(item.key, {});
        }
    },
    closeToolbar: function(){
        this.setState({
            showToolbar: false,
        });
    },
    toggleEmbeds: function(){
        var show;
        if(this.state.showEmbeds)
            show = false;
        else
            show = true;
        this.setState({
            showEmbeds: show,
        });
    },
    prepareEmbeds: function(){
        var embeds = this.props.quill.getEmbeds().map(function(item, i){
            return (
                <button onClick={this.triggerEmbed.bind(this, item)} key={i} className={"tb-"+item.key+" embed-button"}>{item.key}</button>
                )
            }.bind(this));

        return (
            <div className="toolbar">{embeds}</div>
            );

    },
    render: function(){
        if(!this.state.showToolbar)
            return false;

        var buttonStyle = {
            transform: "rotate(45deg)",
        }

        return (
            <div style={{top: this.state.offset}}>
                <div className="side-button">
                    <button style={this.state.showEmbeds ? buttonStyle : null} onClick={this.toggleEmbeds} className="tb-toolbar"><span>+</span></button>
                </div>
                {this.state.showEmbeds ? this.embeds : null}
            </div>
            )
    }
});

var factory = function(quill, options) {

    var toolbarContainer = quill.addContainer('inline-toolbar');

    var toolbar = React.render(
        <InlineToolbar quill={quill} />,
        toolbarContainer
    );

}

module.exports = factory;
