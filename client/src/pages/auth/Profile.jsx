import React, {useState, useMemo} from 'react'
import {toast} from 'react-toastify'
import {useQuery, useMutation} from '@apollo/react-hooks'
import { USER_UPDATE } from '../../graphql/mutations'
import { PROFILE } from '../../graphql/queries'

export default function Profile() {
    const [values, setValues] = useState({
        username: '',
        name: '',
        email: '',
        about: '',
        images: []
    })
    const [loading, setLoading] = useState(false);

    const {data} = useQuery(PROFILE);

    useMemo(()=>{
        if(data){
            console.log(data.profile)
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
    const handleImageChange = () => {

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
            <label htmlFor="images">Images</label>
            <input type="file" 
                accept='image/*'
                onChange={handleImageChange} 
                className="form-control" 
                placeholder='Images' 
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
        <div className='container p-5'>
            {profileUpdateForm}
        </div>
    )
}
