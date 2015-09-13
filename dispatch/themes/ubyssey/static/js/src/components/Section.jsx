var Section = React.createClass({
    getInitialState: function(){
        return {
            articles: [],
            loading: false,
        }
    },
    componentDidMount: function(){
        this.loaded = 0;
        this.scrollListener();
    },
    scrollListener: function(){

        var updateScroll = function(){

            var windowHeight = $(window).height();
            var documentHeight = $(document).height();
            var topPos = $(document).scrollTop();
            var bottomPos = topPos + windowHeight;

            if(bottomPos == documentHeight)
                this.loadMore();

        }.bind(this);

        $(window).scroll(updateScroll);

    },
    renderSpinner: function(){
        return (
            <div className="spinner">
              <div className="rect1"></div>
              <div className="rect2"></div>
              <div className="rect3"></div>
              <div className="rect4"></div>
              <div className="rect5"></div>
            </div>
            );
    },
    loadMore: function(){
        if(this.state.loading || this.loaded >= 5)
            return;

        this.setState({ loading: true });

        dispatch.search("article", { section: this.props.id, offset: 7 + (6 * this.loaded), limit: 6 }, function(data){
            this.loaded++;
            this.setState({ articles: this.state.articles.concat(data.results), loading: false });
        }.bind(this));
    },
    renderImage: function(article){
        var style = { backgroundImage: "url('" + article.featured_image.url + "')" };
        return (
            <a href={ article.url } className="image image-aspect-4-3">
                <div style={style}></div>
            </a>
            )
    },
    render: function(){
        var articles = this.state.articles.map(function(article, i){
            return (
                <article key={i}>
                    { article.featured_image ? this.renderImage(article) : null }
                    <a href={ article.url }><h2 className="headline">{ article.long_headline }</h2></a>
                    <span className="byline"><span className="author">By { article.authors_string }</span> &nbsp;·&nbsp; <span className="published">{ article.published_at }</span></span>
                    <p className="snippet">{ article.snippet }</p>
                </article>
                );
        }.bind(this));

        return (
            <div>
                <div className="blocks">{articles}</div>
                {this.state.loading ? this.renderSpinner() : null }
            </div>
        )
    }
});

module.exports = Section;