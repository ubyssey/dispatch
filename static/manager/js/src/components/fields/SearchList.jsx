var React = require('react');

var SearchList = React.createClass({
    getInitialState: function(){
        return {
            results: [],
            initialItems: false,
            query: "",
            searching: false,
        }
    },
    componentDidMount: function(){
        this.props.initialItems(function(items){
            this.setState({
                initialItems: items,
            });
        }.bind(this));
        this.refs.searchField.getDOMNode().focus();
    },
    handleKeyPress: function(event){
        if(event.key === 'Enter'){
            this.props.createItem(event.target.value, function(item){
                this.selectItem(item);
            }.bind(this));
        }
    },
    updateQuery: function(event){
        var query = event.target.value;
        this.setState({
            query: query,
        });
        if(query.length >= 1){
            this.props.searchItems(query, function(results){
                console.log(results);
                this.setState({
                    results: results,
                    searching: true,
                });
            }.bind(this));
        } else if (query.length == 0){
            this.setState({
               searching: false,
            });
        } else {
            this.setState({
                results: [],
                searching: true,
            });
        }
    },
    selectItem: function(item){
        this.props.selectItem(item);
    },
    renderResults: function(results){
        return results.map(function(item, i){
            return (
                <li key={i} onClick={this.selectItem.bind(this, item)}>{this.props.renderItem(item)}</li>
                )
        }.bind(this));
    },
    renderNoResults: function(message){
        if(this.props.createItem){
           return (
                 <li className="disabled">{'Press enter to add "' + this.state.query + '"'}</li>
                )
        } else {
            return (
                 <li>{message}</li>
                )
        }
    },
    render: function(){
        if(this.state.searching){
            var results = this.state.results.length > 0 ? this.renderResults(this.state.results) : this.renderNoResults("No results found.");
        } else {
            var results = this.state.initialItems ? this.renderResults(this.state.initialItems) : this.renderNoResults("Loading list...");
        }
        return (
            <div className="search-field">
                <div className="search-bar">
                    <input ref="searchField" onChange={this.updateQuery} onKeyPress={this.handleKeyPress} value={this.state.query} placeholder="Search" type="text" />
                </div>
                <ul>{results}</ul>
            </div>
            )
    }
});

module.exports = SearchList;