var Textarea = require('react-textarea-autosize');

var CommentBox = React.createClass({
    getInitialState: function(){
        return {
            content: "",
        }
    },
    updateContent: function(event){
        this.setState({ content: event.target.value });
    },
    handlePost: function(){
        this.props.postHandler(this.state.content, function(){
            this.setState({ content: "" });
        }.bind(this));
    },
    renderLogin: function(){
        return (
            <div className="comments-field login">
                <p>You must login or register before posting a comment.</p>
                <a href="/login/" className="button">Login</a>
                <a href="/register/" className="button">Register</a>
            </div>
            );
    },
    renderInput: function(){
        return (
            <div className="comments-field">
                <Textarea rows={2} placeholder="Join the conversation..." onChange={this.updateContent} value={this.state.content} />
                <button className="right" onClick={this.handlePost}>Post Comment</button>
            </div>
            );
    },
    render: function(){
        return this.props.loggedIn ? this.renderInput() : this.renderLogin();
    }
});

module.exports = CommentBox;