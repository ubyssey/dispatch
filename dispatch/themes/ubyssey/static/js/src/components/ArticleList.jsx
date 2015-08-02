var React = require('react');

var Article = require('./Article.jsx');
var CommentsBar = require('./CommentsBar.jsx');
var ArticleHeader = require('./ArticleHeader.jsx');


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
            articles: [this.props.firstArticle],
            loading: false
        }
    },
    componentWillMount: function(){
        this.articlesTable = {};
        this.articlesTable[this.props.firstArticle.id] = 0;
    },
    componentDidMount: function(){
        this.loaded = [this.props.firstArticle.id];
        this.afterLoad = null;

        this.scrollListener();
        if(this.state.active.next)
            this.loadNext(this.state.active.next.id);
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
    getArticle: function(id){
        return this.state.articles[this.articlesTable[id]];
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
            height: height
        }
    },
    scrollListener: function(){
        var windowHeight = $(window).height();
        var documentHeight = $(document).height();

        var cachedPoints;
        var points;
        var timer = 0;

        var updateScroll = function(){

            var topPos = $(document).scrollTop();
            var bottomPos = topPos + windowHeight;

            this.updateHeader(topPos);

            if(cachedPoints != this.state.active.id){
                points = this.getArticlePoints();
                cachedPoints = this.state.active.id;
            }

            if(bottomPos > points.end)
                this.prepNext();

            if(topPos > points.end + 50 || (points.height < windowHeight && bottomPos > (documentHeight - 50)))
                this.setNext();

            if(bottomPos < points.top - 50)
                this.setPrev();

        }.bind(this);

        $(window).scroll(updateScroll);

    },
    setPrev: function(){
        if(!this.state.active.prev)
            return;

        this.setState({ active: this.state.active.prev }, this.updateURL);
    },
    prepNext: function(){
        if(!this.state.active.next || !this.state.active.next.next)
            return
        if(!this.isLoaded(this.state.active.next.next.id))
            this.loadNext(this.state.active.next.next.id);
    },
    setNext: function(){

        if(!this.state.active.next)
            return;

        if(!this.isLoaded(this.state.active.next.id)){
            this.loadNext(this.state.active.next.id);
            this.afterLoad = this.setNext;
            return;
        }

        if(this.state.loading){
            this.afterLoad = this.setNext;
            return;
        }

        this.setState({ active: this.state.active.next }, this.updateURL);
    },
    updateURL: function(){
        history.pushState(null, null, this.getArticle(this.state.active.id).url);
    },
    loadNext: function(article_id){
        if(this.state.loading || this.isLoaded(article_id))
            return;
        this.loadArticle(article_id);
    },
    isLoaded: function(id){
        var id = parseInt(id);
        return this.loaded.indexOf(id) !== -1;
    },
    loadArticle: function(article_id){
        this.setState({ loading: true });
        dispatch.articleRendered(article_id, function(data){
            this.loaded.push(parseInt(article_id));
            this.renderArticle(data);
        }.bind(this));
    },
    renderArticle: function(data){
        var articles = this.state.articles;
        articles.push(data);

        this.setState({ loading: false, articles: articles }, function(){

            this.articlesTable[data.id] = articles.length - 1;

            if(!this.afterLoad){
                return
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