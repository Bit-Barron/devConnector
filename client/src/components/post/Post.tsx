import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PostItem from '../posts/PostItem';
import { getPost } from '../../actions/post';
import { useParams, Link } from 'react-router-dom';
import CommentForm from '../post/CommentForm';
import CommentItem from '../post/CommentItem';

const Post = ({ getPost, post: { post, loading }, match }: any) => {
  const { id } = useParams();

  useEffect(() => {
    getPost(id);
  }, [getPost]);

  return loading || post === null ? (
    <Spinner />
  ) : (
    <>
      <Link to='/posts' className='btn'>
        Back To Posts
      </Link>
      <PostItem post={post} showActions={false} />
      <CommentForm postId={post._id} />
      <div className="comments">
        {post.comments.map((comment: any) => (
            <CommentItem key={comment._id} comment={comment} postId={post._id} />
        ))}
      </div>
    </>
  );
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state: any) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPost })(Post);
