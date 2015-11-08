(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var Section = React.createClass({displayName: "Section",
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
            React.createElement("div", {className: "spinner"}, 
              React.createElement("div", {className: "rect1"}), 
              React.createElement("div", {className: "rect2"}), 
              React.createElement("div", {className: "rect3"}), 
              React.createElement("div", {className: "rect4"}), 
              React.createElement("div", {className: "rect5"})
            )
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
            React.createElement("a", {href:  article.url, className: "image image-aspect-4-3"}, 
                React.createElement("div", {style: style})
            )
            )
    },
    render: function(){
        var articles = this.state.articles.map(function(article, i){
            var headline = { '__html': article.headline };
            return (
                React.createElement("article", {key: i}, 
                     article.featured_image ? this.renderImage(article) : null, 
                    React.createElement("a", {href:  article.url}, React.createElement("h2", {className: "headline", dangerouslySetInnerHTML: headline})), 
                    React.createElement("span", {className: "byline"}, React.createElement("span", {className: "author"}, "By ",  article.authors_string), "  ·  ", React.createElement("span", {className: "published"},  this.renderPubDate(article.published_at) )), 
                    React.createElement("p", {className: "snippet"},  article.snippet)
                )
                );
        }.bind(this));

        return (
            React.createElement("div", null, 
                React.createElement("div", {className: "blocks"}, articles), 
                this.state.loading ? this.renderSpinner() : null
            )
        )
    }
});

module.exports = Section;

},{}],2:[function(_dereq_,module,exports){
var Section = _dereq_('./components/Section.jsx');

var sectionId = $('main.section').data('id');

React.render(
    React.createElement(Section, {id: sectionId}),
    document.getElementById('article-loader')
);

},{"./components/Section.jsx":1}]},{},[2]);
