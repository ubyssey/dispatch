var React = require('react');

var Image = React.createClass({
    onClick: function(){
        this.props.onClickHandler(this.props.id);
    },
    render: function(){
        var styles = {backgroundImage: "url('" + this.props.thumb + "')"};
        if(this.props.progress){
        //    styles.opacity = 100 / this.props.progress;
        }
        return (
            <li className={"catalog-image" + (this.props.selected ? " selected" : "")} onClick={this.onClick} style={styles} data-id={this.props.id} data-url={this.props.url}></li>
        );
    }
});

module.exports = Image;
