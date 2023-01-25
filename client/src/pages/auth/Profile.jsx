import React, {useState, useMemo, useContext} from 'react'
import {toast} from 'react-toastify'
import {useQuery, useMutation} from '@apollo/react-hooks'
import { USER_UPDATE } from '../../graphql/mutations'
import { PROFILE } from '../../graphql/queries'
import Resizer from "react-image-file-resizer";
import axios from 'axios';
import { AuthContext } from '../../context/authContext'

export default function Profile() {
    const {state} = useContext(AuthContext);
    const [values, setValues] = useState({
        username: '',
        name: '',
        email: '',
        about: '',
        images: []
    })
    const [loading, setLoading] = useState(false);

    const {data, refetch} = useQuery(PROFILE);

    useMemo(()=>{
        refetch()
        if(data){
            setValues({
                ...values,
                username: data.profile.username,
                name: data.profile.name,
                email: data.profile.email,
                about: data.profile.about,
                images: data.profile.images
            })
        }
    }, [data]);

    // Mutation
    const [userUpdate] = useMutation(USER_UPDATE, {
        update: ({data}) => {
            console.log('USER UPDATE MUTATION IN PROFILE', data);
            toast.success('Profile updated');
            // console.log(...data)
            // setValues(...data.profile)
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        userUpdate({variables: {input: values}});
        setLoading(false);
    };
    const handleChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value})
    };

    const resizeFile = (file) => new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            300,
            300,
            "JPEG",
            100,
            0,
            (uri) => {
                resolve(uri);
            },
            "base64"
        );
    });
    const fileResizeAndUpload = async (e) => {
        try {
            const file = e.target.files[0];
            const image = await resizeFile(file);
            // console.log(image);
            axios.post(
                `${import.meta.env.VITE_REST_ENDPOINT}/uploadimages`,
                {image},
                {headers: {
                    authtoken: state.user.token
                }}
            )
            .then(response =>{
                setLoading(false);
                console.log('CLOUDINARY UPLOAD', response);
                setValues({...values, images: [...images, response.data]})
            })
            .catch(error =>{
                setLoading(false);
                console.log('CLOUDINARY UPLOAD FAILED', error);
            })
          } catch (err) {
            console.log(err);
          }    
    };

    const handleImageRemove = (id) => {
        setLoading(true);
        axios.post(
                `${import.meta.env.VITE_REST_ENDPOINT}/removeimage`,
                {
                    public_id: id
                },
                {
                    headers: {
                        authtoken: state.user.token
                    }
                }
            )
            .then((response) => {
                setLoading(false);
                let filteredImages = images.filter((item) => {
                    return item.public_id !== id;
                });
                setValues({ ...values, images: filteredImages });
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    };

    const {username, name, email, about, images} = values;

    const profileUpdateForm = <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" 
                name='username' 
                value={username} 
                onChange={handleChange} 
                className="form-control" 
                placeholder='Username' 
                disabled={loading}
            />
        </div>
        <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" 
                name='name' 
                value={name} 
                onChange={handleChange} 
                className="form-control" 
                placeholder='Name' 
                disabled={loading}
            />
        </div>
        <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="text" 
                name='email' 
                value={email} 
                onChange={handleChange} 
                className="form-control" 
                placeholder='Email' 
                disabled
            />
        </div>
        <div className="form-group">
            <label htmlFor="about">About</label>
            <textarea 
                name='about' 
                value={about} 
                onChange={handleChange} 
                className="form-control" 
                placeholder='About' 
                disabled={loading}
            />
        </div>
        <button className="btn btn-primary"
            type="submit"
            disabled={!email || loading}
        >Submit</button>
    </form>

return (
    <div className="container p-5">
        <div className="row">
            <div className="col-md-3">
                <div className="form-group">
                    <label className="btn btn-primary">
                        Upload Image
                        <input
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={fileResizeAndUpload}
                            className="form-control"
                            placeholder="Image"
                        />
                    </label>
                </div>
            </div>
            <div className="col-md-9">
                {images.map((image) => (
                    <img
                        src={image.url}
                        key={image.public_id}
                        alt={image.public_id}
                        style={{ height: '100px' }}
                        className="float-right"
                        onClick={()=>handleImageRemove(image.public_id)}
                    />
                ))}
            </div>
        </div>
        {profileUpdateForm}
    </div>
);
}
