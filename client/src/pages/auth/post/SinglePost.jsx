import React, {useState, useMemo, useEffect} from 'react'
import { useLazyQuery } from '@apollo/react-hooks'
import { SINGLE_POST } from '../../../graphql/queries'
import { useParams } from 'react-router-dom'
import PostCard from '../../../components/PostCard'

const initialState = {
    content: '',
    images: [{
        url: '',
        public_id: ''
    }],
    postedBy: ''
}

export default function SinglePost() {
    const [values, setValues] = useState(initialState)
    const [getSinglePost, {data: singlePost}] = useLazyQuery(SINGLE_POST)
    const {postid} = useParams();

    useEffect(() => {
        getSinglePost({variables: {postId: postid}});
    }, [])

    useMemo(() => {
        if(singlePost){
            setValues({
                ...values, 
                _id: singlePost.singlePost._id,
                content: singlePost.singlePost.content,
                images: singlePost.singlePost.images,
                postedBy: singlePost.singlePost.postedBy
            })
        }
    }, [singlePost]);

    return (
    <div className='container p-5'>
        <PostCard post={values}/>
    </div>
  )
}
