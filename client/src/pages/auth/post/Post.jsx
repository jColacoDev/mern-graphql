import React, {useState, useContext, useEffect} from 'react'
import {toast} from 'react-toastify'
import { useQuery, useMutation } from '@apollo/react-hooks'
import FileUpload from '../../../components/FileUpload'
import { POST_CREATE, POST_DELETE } from '../../../graphql/mutations'
import { POSTS_BY_USER } from '../../../graphql/queries'
import PostCard from '../../../components/PostCard'
import { useNavigate } from 'react-router-dom'
 
const initialState = {
    content: '',
    images: [{
        url: 'https://via.placeholder.com/200x200.png?text=POST',
        public_id: '123'
    }]
}

export default function Post() {
    const [values, setValues] = useState(initialState)
    const [loading, setLoading] = useState(false)
    
    const navigate = useNavigate();
    
    // query
    const {data: postsData} = useQuery(POSTS_BY_USER);

    // mutation
    const [postDelete] = useMutation(POST_DELETE, {
        update: ({data})=> {
            console.log("POST DELETE MUTATION", data);
            toast.error('Post deleted');
        },
        onError: (err) => {
            console.log(err);
            toast.error("Post delete failed");
        }
    });
    const [postCreate] = useMutation(POST_CREATE, {
        // update cache
        update: (cache, {data: {postCreate}}) => {
            // readQuery from cache
            const {postsByUser} = cache.readQuery({
                query: POSTS_BY_USER
            });
            // writeQuery to cache
            cache.writeQuery({
                query: POSTS_BY_USER,
                data: {
                    postsByUser: [postCreate, ...postsByUser]
                }
            })
        },
        onError: (err) => console.log(err.graphqQLError[0].message)
    });

    // destructure
    const {content, images} = values;

    const handleUpdate = async postId => {
        navigate(`/post/update/${postId}`)
    }
    const handleDelete = async (postId) => {
        let answer = window.confirm('Delete?');
        if (answer) {
            setLoading(true);
            postDelete({
                variables: { postId },
                refetchQueries: [{ query: POSTS_BY_USER }]
            });
            setLoading(false);
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        postCreate({variables: {input: values}});
        setValues(initialState);
        setLoading(false);
        toast.success('Post created');
    }
    
    function handleChange(e){
        e.preventDefault();
        setValues({...values, [e.target.name]: e.target.value})
    }
    
    const createForm= <form onSubmit={handleSubmit}>
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

    return <div className='container p-5'>
        {loading ? 
            <h4 className="text-danger">Loading...</h4> : 
            <h4>Create Post</h4>
        }
        <FileUpload 
            values={values}
            loading={loading}
            setValues={setValues}
            setLoading={setLoading}
        />
        <div className="col-md-9">
            <div className="col">{createForm}</div>
        </div>        <hr />
        <div className="row p-5">
        {postsData && postsData.postsByUser.map((post) => (
            <div className="col-md-6 pt-5" key={post._id}>
                <PostCard post={post} 
                    showUpdateButton={true} 
                    showDeleteButton={true}
                    handleDelete={handleDelete}
                    handleUpdate={handleUpdate}
                />
            </div>
        ))}
        </div>
    </div>
}
