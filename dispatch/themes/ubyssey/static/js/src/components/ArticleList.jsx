var Article = require('./Article.jsx');
var CommentsBar = require('./CommentsBar.jsx');
var ArticleHeader = require('./ArticleHeader.jsx');
var LinkedList = require('../modules/LinkedList.js');

var ArticleList = React.createClass({
    getInitialState: function(){
        var articles = this.props.articles;
        articles.unshift(this.props.firstArticle.id);

        return {
            active: LinkedList(articles),
            articles: [this.props.firstArticle],
            loading: false,
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
            this.loadNext(this.state.active.next.data);
    },
    updateHeader: function(topPos){

        if (topPos > 50 && !window.articleHeader){
            window.articleHeader = true;
            $('.header-site').hide();
            $('.header-article').show();
        } else if (topPos < 50 && window.articleHeader){
            window.articleHeader = false;
            $('.header-article').hide();
            // Only display site header if width > $bp-larger-than-tablet
            console.log($(window).width());
            if($(window).width() > 960) {
              $('.header-site').show();
            }
        }

    },
    getArticle: function(id){
        return this.state.articles[this.articlesTable[id]];
    },
    getArticlePoints: function(){
        var $article = $('#article-'+this.state.active.data);
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

        var updateScroll = function(){

            var topPos = $(document).scrollTop();
            var bottomPos = topPos + windowHeight;

            if($(window).width() > 400)
                this.updateHeader(topPos);

            if(cachedPoints != this.state.active.data){
                points = this.getArticlePoints();
                cachedPoints = this.state.active.data;
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
        if(!this.isLoaded(this.state.active.next.next.data))
            this.loadNext(this.state.active.next.next.data);
    },
    setNext: function(){

        if(!this.state.active.next)
            return;

        if(!this.isLoaded(this.state.active.next.data)){
            this.loadNext(this.state.active.next.data);
            this.afterLoad = this.setNext;
            return;
        }

        if(this.state.loading){
            this.afterLoad = this.setNext;
            return;
        }

        // Google analytics pageview
        ga('set', 'dimension1', "Peter Siemens");
        ga('send', 'pageview');
        // refresh ads
        googletag.pubads().refresh();

        this.setState({ active: this.state.active.next }, this.updateURL);
    },
    updateURL: function(){
        history.pushState(null, null, this.getArticle(this.state.active.data).url);
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
                <ArticleHeader name={this.props.name} headline={this.getArticle(this.state.active.data).headline} />
                {articles}
            </div>
            );
        // <CommentsBar breakpoint={this.props.breakpoint} userId={this.props.userId} articleId={this.state.active.data} />
    }
})

module.exports = ArticleList;