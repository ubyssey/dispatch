var React = require('react');
var ModelDropdown = require('../fields/ModelDropdown.jsx');

var HyperlinkModule = function(quill, options) {

    var HyperlinkTooltip = React.createClass({
        getInitialState: function(){
            return {
                position: [0,0],
                visible: false,
                href: null,
                type: 'href',
                article: {}
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

                if(anchor){
                    this.range = quill.getSelection();
                    if(anchor.hasAttribute('data-id')){
                        this.setState({
                            position: this.getPosition(anchor),
                            article: {
                                'id': anchor.getAttribute('data-id'),
                                'headline': anchor.getAttribute('data-headline'),
                                'url': anchor.href
                            },
                            href: null,
                            type: 'article',
                            visible: true
                        });
                    } else {
                        this.setState({
                            position: this.getPosition(anchor),
                            href: anchor.href,
                            article: {},
                            type: 'href',
                            visible: true
                        });
                    }
                } else {
                    this.range = null;
                    if(this.state.visible){
                        this.setState({ visible: false });
                    }
                }
            }.bind(this));

            quill.onModuleLoad('toolbar', function(toolbar){
                toolbar.initFormat('link', function(range, value){
                    this.onToolbar(range, value);
                }.bind(this));
            }.bind(this));
        },
        onToolbar: function(range, value){
            if(!range || range.isCollapsed())
                return;
            this.range = range;
            if(value){
                var nativeRange = quill.editor.selection._getNativeRange();
                this.setState({
                    visible: true,
                    position: this.getPosition(nativeRange),
                    type: 'href',
                    article: {},
                    href: this.suggestUrl(range)
                });
            } else {
                quill.formatText(range, 'link', false, 'user')
            }
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
        updateHyperlink: function(event){
            event.preventDefault();
            this.setHyperlink();
            this.setState({ visible: false });
        },
        removeHyperlink: function(event){
            event.preventDefault();
            var anchor = this.findAnchor(this.range);
            if(anchor){
                var text = anchor.innerHTML;
                anchor.parentNode.removeChild(anchor);
                quill.insertText(this.range, text);
            }

            this.setState({ visible: false });
        },
        setHyperlink: function(){
            if(this.state.type == 'href'){
                this.setHref();
            } else {
                this.setArticle();
            }
        },
        setHref: function(){
            var url = this.normalizeUrl(this.state.href);
            if(this.range){
                if(this.range.isCollapsed()){
                    var anchor = this.findAnchor(this.range);
                    if(anchor){
                        anchor.href = url;
                        if(anchor.hasAttribute('data-id')){anchor.removeAttribute('data-id')}
                        if(anchor.hasAttribute('data-headline')){anchor.removeAttribute('data-headline')}
                    }
                } else {
                    quill.formatText(this.range, 'link', url, 'user')
                }
            }
        },
        setArticle: function(){
            var url = this.normalizeUrl(this.state.article.url);
            if(this.range){
                if(!this.range.isCollapsed()){
                    quill.formatText(this.range, 'link', url, 'user');
                }
                var anchor = this.findAnchor(this.range);
                if(anchor){
                    anchor.href = url;
                    anchor.setAttribute('data-id', this.state.article.parent);
                    anchor.setAttribute('data-headline', this.state.article.headline);
                }
            }
        },
        suggestUrl: function(range){
            text = quill.getText(range);
            return this.normalizeUrl(text);
        },
        normalizeUrl: function(url){
            if(! /^(https?:\/\/|mailto:)/.test(url)){
                url = 'http://' + url;
            }
            return url;
        },
        getVisitUrl: function(){
            return this.state.type == 'href' ? this.state.href : this.state.article.url;
        },
        getPosition: function(node){
            if(node){
                var x = node.getBoundingClientRect().left - document.getElementById('article-editor').getBoundingClientRect().left + (node.offsetWidth / 2) - 225;
                var y = node.getBoundingClientRect().top - document.getElementById('article-editor').getBoundingClientRect().top + 30;
                if(x < 50 + 10){ x = 50 + 10; }
                if(x > 600 - 225 - 10){ x = 600 - 225 - 10; }
            } else {
                var x = quill.container.offsetWidth/2 - 225;
                var y = quill.container.offsetHeight/2 - 225;
            }
            return [x, y];
        },
        changeType: function(type, event){
            event.preventDefault();
            this.setState({ type: type });
        },
        updateArticle: function(field, data){
            this.setState({ article: data });
        },
        updateHref: function(event){
            this.setState({ href: event.target.value });
        },
        renderHref: function(){
            return (<input type="text" placeholder="Enter a URL" value={this.state.href} onChange={this.updateHref}></input>);
        },
        renderArticle: function(){
            return (<ModelDropdown model="article" item_key="parent" display="headline" name="article" data={this.state.article} updateHandler={this.updateArticle} />);
        },
        render: function(){
            var style = {
                'left': this.state.position[0],
                'top': this.state.position[1]
            };

            return(
                <div style={style} className={"hyperlink-tooltip" + (this.state.visible ? " visible" : "")}>
                    <div className="options">
                        <a href="#" className={this.state.type == 'href' ? 'active' : ''} onClick={this.changeType.bind(this, "href")}><i className="fa fa-link"></i> URL</a>
                        <a href="#" className={this.state.type == 'article' ? 'active' : ''} onClick={this.changeType.bind(this, "article")}><i className="fa fa-file-text-o"></i> Article</a>
                    </div>
                    <div className="body">
                        <div className="url-field">
                            <div className="left">
                                {this.state.type == 'href' ? this.renderHref() : this.renderArticle()}
                            </div><div className="right">
                                <button className="dis-button green" onClick={this.updateHyperlink}>Update</button>
                            </div>
                        </div>
                        <div className="links">
                            <a href="#" onClick={this.removeHyperlink}>Remove Link</a>
                            <a href={this.getVisitUrl()} target="_blank">{'Visit ' + (this.state.type == 'href' ? 'URL' : 'Article')}</a>
                        </div>
                    </div>
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