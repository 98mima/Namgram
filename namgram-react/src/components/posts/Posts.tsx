import { CircularProgress, createStyles, makeStyles, Theme } from '@material-ui/core';
import React, { useEffect } from 'react'

import {useSelector, useDispatch} from 'react-redux'
import { RootState } from '../../redux';
import { loadPosts } from '../../redux/posts/actions';
import Post from './Post';

const useStyles = makeStyles((theme: Theme) => createStyles({
    container:{
        display: "flex",
        flexDirection: "column"
    },
    loading: {
        margin: "20vh auto auto auto"
    }
}));

function Posts() {
    const classes= useStyles();
    const dispatch = useDispatch();
    const posts = useSelector((state: RootState) => state.posts.posts);
    useEffect(() => {
        dispatch(loadPosts());
    }, []);

    const loading = useSelector((state: RootState) => state.ui.loading);    

    return (
        <React.Fragment>
            <div className={classes.container}>
                {loading && <CircularProgress size={'20vw'} className={classes.loading} />}
                {posts && posts.map(post => <Post key={post.id} post={post} />)}
            </div>
        </React.Fragment>
    )
}

export default Posts
