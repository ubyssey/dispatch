var React = require('react');

var DropdownButton = React.createClass({
    getInitialState: function(){
        return {
            active: false,
        }
    },
    componentDidMount: function(){
      window.addEventListener("click", this.pageClick, false);
    },
    pageClick: function() {
        // Clicking outside button/ul closes it.
        // Clicking inside gets handled by toggleActive, which then stops
        // the click from bubbling up to here.

        this.setState({
            active: false
        });
    },
    toggleActive: function(e){
        e.stopPropagation();
        this.setState({
            active: !this.state.active
        });
    },
    selectItem: function(value, e){
        // If multiple dropdowns are open, selecting an item only closes
        // this one (doesn't bubble up to the page).
        e.stopPropagation();
        this.setState({
            active: false,
        });
        return this.props.selectItem(value);
    },
    renderDropdown: function(){
        var items = this.props.items.map(function(item, i){
            return ( <li key={i} onClick={this.selectItem.bind(this, item.value)}>{item.label}</li> );
        }.bind(this));
        return (
            <ul className="dropdown-panel items">
                {items}
            </ul>
            );
    },
    render: function(){
        return (
            <div className={"dis-button dropdown-button " + (this.props.push ? this.props.push : "right")}>
                <button onClick={this.toggleActive}>{this.props.children} <i className="fa fa-caret-down"></i></button>
                {this.state.active ? this.renderDropdown() : null}
            </div>
            )
    }
})

module.exports = DropdownButton;