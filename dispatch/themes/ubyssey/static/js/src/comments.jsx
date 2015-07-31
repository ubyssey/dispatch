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
    renderInput(){
        return (
            <div className="comments-field">
                <textarea placeholder="Join the conversation..." onChange={this.updateContent} value={this.state.content} />
                <button className="right" onClick={this.handlePost}>Post Comment</button>
            </div>
            );
    },
    render: function(){
        return this.props.loggedIn ? this.renderInput() : this.renderLogin();
    }
});

var CommentsBar = React.createClass({
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
            <div className="spinner">
              <div className="rect1"></div>
              <div className="rect2"></div>
              <div className="rect3"></div>
              <div className="rect4"></div>
              <div className="rect5"></div>
            </div>
            );
    },
    render: function(){
        var comments = this.state.comments.map(function(comment, i){
            return (<Comment key={comment.id} comment={comment} />);
        }.bind(this));

        return (
            <div className={"inner" + (this.state.active ? " active" : "")}>
                <div className="close">
                    <div className="u-pull-left">
                        <h3><i className="fa fa-comment"></i> {this.state.comments.length + " comments"}</h3>
                    </div>
                    <div className="u-pull-right">
                        <button onClick={this.toggle.bind(this, false)}><i className="fa fa-close"></i></button>
                    </div>
                </div>
                <CommentBox loggedIn={this.props.userId ? true : false} postHandler={this.postComment} />
                <div className="sort">
                    <a href="#" className={this.state.sort == 'recent' ? 'active' : ''} onClick={this.changeSort.bind(this, 'recent')}>Recent</a>
                    &middot;
                    <a href="#" className={this.state.sort == 'top' ? 'active' : ''} onClick={this.changeSort.bind(this, 'top')}>Top</a>
                </div>
                <div className="comments-list">
                    {this.state.loading ? this.renderSpinner() : comments}
                </div>
            </div>
            );
    }
});

var articleId = $('article').data('id');
var userId = $('article').data('user-id');

var commentsBar = React.render(
    <CommentsBar userId={userId} articleId={articleId} />,
    document.getElementById('comments-bar')
);