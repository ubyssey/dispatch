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

        var query = { offset: 7 + (6 * this.loaded), limit: 6 }
        query[this.props.type] = this.props.id;

        dispatch.search("article", query, function(data){
            this.loaded++;
            this.setState({ articles: this.state.articles.concat(data.results), loading: false });
        }.bind(this));
    },
    renderPubDate: function(pubDate) {
        var dateObj = new Date(pubDate);
        var months = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
        var dateString = months[dateObj.getMonth()] + " " + dateObj.getDate() + ", " + dateObj.getFullYear() + ", ";
        var ampm, hour, minute;
        if(dateObj.getHours() < 12) {
            ampm = "a.m.";
            if(dateObj.getHours() == 0) {
                hour = "12";
            }
            else {
                hour = String(dateObj.getHours());
            }
        }
        else {
            ampm = "p.m.";
            hour = String(dateObj.getHours() - 11);
        }
        if(dateObj.getMinutes() < 10) {
           minute = "0" + String(dateObj.getMinutes());
        }
        else {
            minute = String(dateObj.getMinutes());
        }
        return dateString + hour + ":" + minute + " " + ampm;
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
            var headline = { '__html': article.headline };
            return (
                <article key={i}>
                    { article.featured_image ? this.renderImage(article) : null }
                    <a href={ article.url }><h2 className="headline" dangerouslySetInnerHTML={headline}></h2></a>
                    <span className="byline"><span className="author">By { article.authors_string }</span> &nbsp;·&nbsp; <span className="published">{ this.renderPubDate(article.published_at) }</span></span>
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