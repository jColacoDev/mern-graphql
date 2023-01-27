import React, {useState, useMemo, useEffect} from 'react'
import {toast} from 'react-toastify'
import { useLazyQuery, useMutation } from '@apollo/react-hooks'
import { SINGLE_POST } from '../../../graphql/queries'
import { POST_UPDATE } from '../../../graphql/mutations'
import { useParams } from 'react-router-dom'
import FileUpload from '../../../components/FileUpload'

const initialState = {
    content: '',
    images: [{
        url: '',
        public_id: ''
    }]
}

export default function PostUpdate() {
    const [values, setValues] = useState(initialState)
    const [loading, setLoading] = useState(false)
    const [getSinglePost, {data: singlePost}] = useLazyQuery(SINGLE_POST)
    const {postid} = useParams();

    const [postUpdate] = useMutation(POST_UPDATE)

    const {images, content} = values;

    useEffect(() => {
        getSinglePost({variables: {postId: postid}});
    }, [])

    useMemo(() => {
        if(singlePost){
            setValues({
                ...values, 
                _id: singlePost.singlePost._id,
                content: singlePost.singlePost.content,
                images: singlePost.singlePost.images
            })
        }
    }, [singlePost]);

    const handleChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        postUpdate({variables: {input: values}});
        setLoading(false);
        toast.success('Post Updated')
    }

    const updateForm = <form onSubmit={handleSubmit}>
        <div className='form-group'>
            <textarea
                value={content}
                onChange={handleChange}
                name="content"
                rows="10"
                className='md-textarea form-control'
                placeholder="Write Something"
                maxLength="150"
                disabled={loading}
            ></textarea>
        </div>
        <button type="submit" disabled={loading || !content} className="btn btn-primary">Post</button>
    </form>

    return (
    <div className='container p-5'>
        {loading ? 
            <h4 className="text-danger">Loading...</h4> : 
            <h4>Update Post</h4>
        }
        <FileUpload 
            values={values}
            loading={loading}
            setValues={setValues}
            setLoading={setLoading}
        />
        {updateForm}
    </div>
  )
}
