var React = require('react');

var Article = require('./Article.jsx');
var CommentsBar = require('./CommentsBar.jsx');
var LinkedList = function(array){

    var Node = function(id){
        return {
            id: id,
            next: null,
            prev: null
        }
    }

    var tail = Node(array[array.length - 1]);
    for(var i = array.length - 2; i >= 0; i--){
        var prev = Node(array[i]);
        tail.prev = prev;
        prev.next = tail;
        tail = prev;
    }
    return tail;

}

var ArticleList = React.createClass({
    getInitialState: function(){
        var articles = this.props.articles;
        articles.unshift(this.props.firstArticle.id);

        return {
            active: LinkedList(articles),
            loading: false
        }
    },
    componentDidMount: function(){
        this.loaded = [this.props.firstArticle];
        this.unloaded = true;
        this.afterLoad = null;
        this.scrollListener();
    },
    updateHeader: function(topPos){

        if (topPos > 50 && !window.articleHeader){
            window.articleHeader = true;
            $('.header-site').hide();
            $('.header-article').show();
        } else if (topPos < 50 && window.articleHeader){
            window.articleHeader = false;
            $('.header-article').hide();
            $('.header-site').show();
        }
    },
    getArticlePoints: function(){
        var $article = $('#article-'+this.state.active.id);
        var height = $article.height();
        var top = $article.position().top;
        var end = top + height;
        return {
            top: top,
            mid: Math.round(end - (height / 2)),
            end: end,
        }
    },
    scrollListener: function(){
        var windowHeight = $(window).height();
        var updateScroll = function(document){

            var scrollPos = $(document).scrollTop() + windowHeight;
            var points = this.getArticlePoints();

            if(scrollPos > (points.mid - 40) && scrollPos < (points.mid + 40)){
                this.loadNext();
            this.updateHeader(topPos);
            }

            if(scrollPos > points.end){
                this.setNext();
            }

            if(scrollPos < points.top){
                this.setPrev();
            }

        }.bind(this);

        $(document).scroll(function() {
            updateScroll(this);
        });
    },
    setPrev: function(){
        if(!this.state.active.prev)
            return;

        this.setState({ active: this.state.active.prev }, this.updateURL);
    },
    },
    setNext: function(){

        if(!this.state.active.next){
            return;
        }

        if(!this.isLoaded(this.state.active.next.id)){
            this.loadNext();
            this.afterLoad = this.setNext;
            return;
        }

        if(this.state.loading){
            this.afterLoad = this.setNext;
            return;
        }

        this.setState({ active: this.state.active.next }, this.updateURL);
    },
    loadNext: function(){

        if(!this.state.active.next || this.state.loading || this.isLoaded(this.state.active.next.id)){
    updateURL: function(){
        history.pushState(null, null, this.getArticle(this.state.active.id).url);
    },
            return;
        }

        this.loadArticle(this.state.active.next.id);

    },
    isLoaded: function(id){
        var id = parseInt(id);
        return this.loaded.indexOf(id) !== -1;
    },
    loadArticle: function(article_id){
        this.setState({ loading: true });
        dispatch.articleRendered(article_id, function(html){
            this.loaded.push(parseInt(article_id));
            this.renderArticle(html);
        }.bind(this));
    },
    renderArticle: function(html){
        var articles = this.state.articles;
        articles.push(html);
        this.setState({ loading: false, articles: articles }, function(){
            if(!this.afterLoad){
                return;
            }
            this.afterLoad();
            this.afterLoad = null;
        });
    },
    render: function(){
        var articles = this.state.articles.map(function(article, i){
            return (<Article articleId={article.id} html={article.html} key={article.id} />);
        });
        return (
            <div>
                <ArticleHeader name={this.props.name} headline={this.getArticle(this.state.active.id).long_headline} />
                {articles}
                <CommentsBar breakpoint={960} userId={this.props.userId} articleId={this.state.active.id} />
            </div>
            );
    }
})

module.exports = ArticleList;