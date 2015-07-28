var React = require('react');

var HyperlinkModule = function(quill, options) {

    var HyperlinkTooltip = React.createClass({
        getInitialState: function(){
            return {
                position: [0,0],
                visible: false,
            }
        },
        componentDidMount: function(){
            this.initListeners();
        },
        initListeners: function(){
            quill.on(quill.constructor.events.SELECTION_CHANGE, function(range){
                if(!range || !range.isCollapsed())
                    return;
                var anchor = this.findAnchor(range);

                console.log(anchor);

                if(anchor){
                    this.setState({
                        position: this.getPosition(anchor),
                        href: anchor.href,
                        visible: true
                    });
                } else {
                    this.range = null;
                    this.setState({ visible: false });
                }
            }.bind(this));
        },
        findAnchor: function(range){
            var leafArray = quill.editor.doc.findLeafAt(range.start, true);
            var leaf = leafArray[0];
            var offset = leafArray[1];
            var node = leaf ? leaf.node : null;
            while(node){
                if(node.tagName == 'A')
                    return node;
                node = node.parentNode;
            }
            return null;
        },
        getPosition: function(node){
            var x = node.getBoundingClientRect().left - document.getElementById('article-editor').getBoundingClientRect().left + (node.offsetWidth / 2) - 150;
            var y = node.getBoundingClientRect().top - document.getElementById('article-editor').getBoundingClientRect().top + 30;
            return [x, y];
        },
        updateHref: function(event){
            this.setState({ href: event.target.value });
        },
        render: function(){
            var style = {
                'left': this.state.position[0],
                'top': this.state.position[1]
            };

            return(
                <div style={style} className={"hyperlink-tooltip" + (this.state.visible ? " visible" : "")}>
                    <input type="text" value={this.state.href} onChange={this.updateHref}></input>
                    <button className="dis-button">Update</button>
                </div>);
        }
    });

    var hyperlinkContainer = quill.addContainer('hyperlink-tooltip-container');

    var toolbar = React.render(
        <HyperlinkTooltip />,
        hyperlinkContainer
    );

};

module.exports = HyperlinkModule;