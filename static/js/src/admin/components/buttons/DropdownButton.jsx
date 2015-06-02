var React = require('react');

var DropdownButton = React.createClass({
    getInitialState: function(){
        return {
            showDropdown: false,
        }
    },
    toggleDropdown: function(){
        var show;
        if(this.state.showDropdown)
            show = false;
        else
            show = true;
        this.setState({
            showDropdown: show,
        });
    },
    selectItem: function(value){
        this.setState({
            showDropdown: false,
        });
        return this.props.selectItem(value);
    },
    renderDropdown: function(){
        var items = this.props.items.map(function(item){
            return (
                <li onClick={this.selectItem.bind(this, item.value)}>{item.label}</li>
                );
        }.bind(this));
        return (
            <ul className="items">
                {items}
            </ul>
            )
    },
    render: function(){
        return (
            <div className="button dropdown">
                <button onClick={this.toggleDropdown}>{this.props.label}</button>
                {this.state.showDropdown ? this.renderDropdown() : null}
            </div>
            )
    }
})

module.exports = DropdownButton;