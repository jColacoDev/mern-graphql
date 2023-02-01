import React from 'react';
import Image from './Image';
import { Link } from 'react-router-dom';

const PostCard = ({ 
    post, 
    showUpdateButton = false, 
    showDeleteButton = false,
    handleDelete = f => f,
    handleUpdate = f => f
}) => {
    const { images, content, postedBy } = post;
    return (
        <div className="card text-center" style={{ minHeight: '375px' }}>
            <div className="card-body">
                {images[0] &&
                    <Link to={`/post/${post._id}`}>
                        <Image image={images[0]} />
                    </Link>
                }
                <h4 className="text-primary">@{post.postedBy.username}</h4>
                <hr />
                <small>{content}</small>
                <br /><br />
                {showDeleteButton && 
                    <button onClick={()=>handleDelete(post._id)} 
                        className='m-2 btn  btn-danger'
                    >Delete</button>
                }
                {showUpdateButton && 
                    <button onClick={()=>handleUpdate(post._id)} 
                        className='m-2 btn  btn-warning'
                    >Update</button>
                }
            </div>
        </div>
    );
};

export default PostCard;
