import React, {useState, useMemo, useContext} from 'react'
import {toast} from 'react-toastify'
import {useQuery, useMutation} from '@apollo/react-hooks'
import { USER_UPDATE } from '../../graphql/mutations'
import { PROFILE } from '../../graphql/queries'
import Resizer from "react-image-file-resizer";
import axios from 'axios';
import { AuthContext } from '../../context/authContext'
import UserProfile from '../../components/forms/UserProfile'


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
        setLoading(true);
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

return (
    <div className="container p-5">
        <div className="row">
            <div className="col-md-12 pb-3">
            { loading ? 
                <h4 className="text-danger">Loading...</h4> : 
                <h4>Profile</h4>
            }
            </div>
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
        <UserProfile 
            {...values}
            loading={loading}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
        />
    </div>
);
}
