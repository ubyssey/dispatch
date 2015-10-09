var key = require('keymaster');
var LRU = require('lru-cache');

var Search = React.createClass({
    getDefaultProps: function(){
        return {
            cacheOptions: {
                max: 150,
            },
        }
    },
    getInitialState: function(){
        return {
            results: [],
            cache: LRU(this.props.cacheOptions),  // entries are {q: results}
            q: "",
            prevQ: "",
        }
    },
    componentDidMount: function(){
        this.refs.search.getDOMNode().focus();
    },
    updateQuery: function(event){
        this.setState({
            prevQ: this.state.q,
            q: event.target.value
        }, this.search);
    },
    search: function(){
        var q = this.state.q;
        if (q.length > 0){
            if (q.length > 1 && q.length > this.state.prevQ.length && this.state.results.length == 0) {
                // We've already typed one char and got no results, so
                // adding more chars to query (making it more specific) cannot help.
                return;
            }

            if (this.state.cache.has(q)) {
                this.setState({ results: this.state.cache.get(q) });
            } else {
                dispatch.search('article', {q: q}, function(data){
                    this.setState(function(prevState, props){
                        prevState.results = data.results;
                        prevState.cache.set(q, data.results);
                        return prevState;
                    });
                }.bind(this));
            }
        } else {
            this.setState({ results: [] });
        }
    },
    render: function(){

        var results = this.state.results.map(function(item, i){
            return (
                <li><a href={item.url} >{item.headline}</a></li>
            );
        });

        return (
            <div className="container">
                <form method="get" action="/search/">
                    <label for="author-search"><i className="fa fa-search"></i></label>
                    <input ref="search" className={this.state.results.length > 0 ? "open" : ""} name="q" id="search-bar" type="text" autoComplete="off" onChange={this.updateQuery} value={this.state.q} placeholder="Search The Ubyssey..." />
                </form>
                <ul className={"results" + (this.state.results.length > 0 ? " open" : "")}>{results}</ul>
            </div>
        )
    }
});

module.exports = Search;
