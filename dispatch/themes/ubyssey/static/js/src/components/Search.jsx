var key = require('keymaster');

var Search = React.createClass({
    getInitialState: function(){
        return {
            results: [],
            q: "",
        }
    },
    componentDidMount: function(){
        this.refs.search.getDOMNode().focus();
    },
    updateQuery: function(event){
        this.setState({ q: event.target.value }, this.search);
    },
    search: function(){
        if(this.state.q.length > 0){
            dispatch.search('article', {q: this.state.q}, function(data){
                this.setState({ results: data.results });
            }.bind(this));
        } else {
            this.setState({ results: [] });
        }
    },
    render: function(){

        var results = this.state.results.map(function(item, i){
            return (
                <li><a href={item.url} >{item.headline|safe}</a></li>
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