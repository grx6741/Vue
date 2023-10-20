
const Comment = ({ username, comment }) => {
    return (
        <div key={comment}>
            <p><b>{username} : {comment}</b></p>
        </div>
    );
}

export default Comment;
