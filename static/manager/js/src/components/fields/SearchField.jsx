var React = require('react');

var SearchField = React.createClass({
    getInitialState: function(){
        return {
            results: [],
            query: "",
        }
    },
    componentDidMount: function(){
         this.refs.search.getDOMNode().focus();
    },
    updateQuery: function(event){
        var query = event.target.value;
        this.setState({
            query: query,
        });
        if(query.length >= 3){
            this.props.searchItems(query, function(results){
                this.setState({
                    results: results,
                });
            }.bind(this));
        } else {
            this.setState({
                results: [],
            });
        }

    },
    renderResults: function(){
        return this.state.results.map(function(item, i){
            return (
                <li onClick={this.props.selectItem.bind(this, item)}>{this.props.renderItem(item)}</li>
                )
        }.bind(this));
    },
    renderNoResults: function(){
        if(this.state.query){
            return (
                 <li>Sorry, no results found.</li>
                )
        }
    },
    render: function(){
        var results = this.state.results.length > 0 ? this.renderResults() : this.renderNoResults();
        return (
            <div className="search-field">
                <div className="search-bar">
                    <input autoFocus ref="search" onChange={this.updateQuery} value={this.state.query} placeholder="Search" type="text" />
                </div>
                <ul>{results}</ul>
            </div>
            )
    }
});

module.exports = SearchField;