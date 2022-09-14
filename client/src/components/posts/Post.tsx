import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Spinner from '../layout/Spinner'
import { getPosts } from '../../actions/post'
import PostItem from './PostItem'

const Post = ({getPosts, post: {posts, loading}}: any) => {
    useEffect(() => {
        getPosts()
    }, [getPosts])

  return loading ? <Spinner /> : (
    <>
    <h1 className='large text-primary'>Posts</h1>
    <p className='lead'>
        <i className="fas fa-user"></i> Welcome to the community
    </p>
    <div className='posts'>
        {posts.map((post: any) => (
            <PostItem key={post._id} post={post} />
        ))}
    </div>
    </>
  )
}

Post.propTypes = {
    getPosts: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
}


const mapStateToProps = (state: any) => ({
    post: state.post
})

export default connect(mapStateToProps, { getPosts}) (Post)