var React = require('react');

var DropdownPanel = React.createClass({
    getInitialState: function(){
        return {
            active: false,
        }
    },
    componentDidMount: function(){
      window.addEventListener("mousedown", this.pageClick, false);
    },
    pageClick: function(e) {
        if (this.mouseIsDownOnField){
            if(this.state.active)
                this.toggleActive(true);
        } else {
            this.toggleActive(false);
        }
    },
    toggleActive: function(active){
        this.setState({
            active: (typeof active === 'undefined') ? !this.state.active : active,
        });
    },
    mouseDownHandler: function () {
        this.mouseIsDownOnField = true;
    },
    mouseUpHandler: function () {
        this.mouseIsDownOnField = false;
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
            active: false,
        });
        return this.props.selectItem(value);
    },
    renderDropdown: function(){
        return (
            <div onMouseDown={this.mouseDownHandler} onMouseUp={this.mouseUpHandler} className="dropdown-panel items">
                {this.props.children}
            </div>
            );
    },
    render: function(){
        return (
            <div className={"dis-button dropdown-button " + (this.props.push ? this.props.push : "right")}>
                <button onClick={this.toggleActive}>{this.props.label}<i className="fa fa-caret-down"></i></button>
                {this.state.active ? this.renderDropdown() : null}
            </div>
            )
    }
})

module.exports = DropdownPanel;