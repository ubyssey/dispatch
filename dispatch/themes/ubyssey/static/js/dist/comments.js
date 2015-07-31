var Comment = React.createClass({displayName: "Comment",
    render: function(){
        return (
            React.createElement("div", {className: "comment"}, 
                React.createElement("div", {className: "meta"}, 
                    React.createElement("span", {className: "user"}, this.props.comment.user), 
                    React.createElement("span", {className: "timestamp"}, this.props.comment.timestamp), 
                    "·", 
                    React.createElement("span", {className: "votes"}, this.props.comment.votes, " points")
                ), 
                React.createElement("p", {className: "login-message"}, this.props.comment.content)
            )
            );
    }
});

var CommentBox = React.createClass({displayName: "CommentBox",
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
            React.createElement("div", {className: "comments-field login"}, 
                React.createElement("p", null, "You must login or register before posting a comment."), 
                React.createElement("a", {href: "/login/", className: "button"}, "Login"), 
                React.createElement("a", {href: "/register/", className: "button"}, "Register")
            )
            );
    },
    renderInput(){
        return (
            React.createElement("div", {className: "comments-field"}, 
                React.createElement("textarea", {placeholder: "Join the conversation...", onChange: this.updateContent, value: this.state.content}), 
                React.createElement("button", {className: "right", onClick: this.handlePost}, "Post Comment")
            )
            );
    },
    render: function(){
        return this.props.loggedIn ? this.renderInput() : this.renderLogin();
    }
});

var CommentsBar = React.createClass({displayName: "CommentsBar",
    getInitialState: function(){
        return {
            comments: [],
            sort: "recent",
            active: false,
        }
    },
    componentDidMount: function(){
        this.initialized = false;
        $('.open-comments').click(function(e){
            e.preventDefault();
            if(!this.initialized){
                this.loadComments();
            }
            this.toggle(true);
        }.bind(this));
    },
    loadComments: function(){
        this.setState({ loading: true });
        dispatch.articleComments(this.props.articleId, function(data){
            this.initialized = true;
            this.setState({
                comments: data.results,
                loading: false
            });
        }.bind(this));
    },
    postComment: function(content, callback){
        dispatch.postComment(this.props.articleId, content, function(data){
            this.loadComments();
            callback();
        }.bind(this));
    },
    changeSort: function(sort, event){
        event.preventDefault();
        this.setState({ sort: sort });
    },
    toggle: function(active){
        this.setState({ active: active });
    },
    renderSpinner: function(){
        return (
            React.createElement("div", {className: "spinner"}, 
              React.createElement("div", {className: "rect1"}), 
              React.createElement("div", {className: "rect2"}), 
              React.createElement("div", {className: "rect3"}), 
              React.createElement("div", {className: "rect4"}), 
              React.createElement("div", {className: "rect5"})
            )
            );
    },
    render: function(){
        var comments = this.state.comments.map(function(comment, i){
            return (React.createElement(Comment, {key: comment.id, comment: comment}));
        }.bind(this));

        return (
            React.createElement("div", {className: "inner" + (this.state.active ? " active" : "")}, 
                React.createElement("div", {className: "close"}, 
                    React.createElement("div", {className: "u-pull-left"}, 
                        React.createElement("h3", null, React.createElement("i", {className: "fa fa-comment"}), " ", this.state.comments.length + " comments")
                    ), 
                    React.createElement("div", {className: "u-pull-right"}, 
                        React.createElement("button", {onClick: this.toggle.bind(this, false)}, React.createElement("i", {className: "fa fa-close"}))
                    )
                ), 
                React.createElement(CommentBox, {loggedIn: this.props.userId ? true : false, postHandler: this.postComment}), 
                React.createElement("div", {className: "sort"}, 
                    React.createElement("a", {href: "#", className: this.state.sort == 'recent' ? 'active' : '', onClick: this.changeSort.bind(this, 'recent')}, "Recent"), 
                    "·", 
                    React.createElement("a", {href: "#", className: this.state.sort == 'top' ? 'active' : '', onClick: this.changeSort.bind(this, 'top')}, "Top")
                ), 
                React.createElement("div", {className: "comments-list"}, 
                    this.state.loading ? this.renderSpinner() : comments
                )
            )
            );
    }
});

var articleId = $('article').data('id');
var userId = $('article').data('user-id');

var commentsBar = React.render(
    React.createElement(CommentsBar, {userId: userId, articleId: articleId}),
    document.getElementById('comments-bar')
);