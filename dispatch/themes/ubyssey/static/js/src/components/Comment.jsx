var Comment = React.createClass({
    render: function(){
        return (
            <div className="comment">
                <div className="meta">
                    <span className="user">{this.props.comment.user}</span>
                    <span className="timestamp">{this.props.comment.timestamp}</span>
                    &middot;
                    <span className="votes">{this.props.comment.votes} points</span>
                </div>
                <p className="login-message">{this.props.comment.content}</p>
            </div>
            );
    }
});

module.exports = Comment;