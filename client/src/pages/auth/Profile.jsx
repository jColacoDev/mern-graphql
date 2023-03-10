import React, {useState, useMemo, useContext} from 'react'
import {toast} from 'react-toastify'
import {useQuery, useMutation} from '@apollo/react-hooks'
import { USER_UPDATE } from '../../graphql/mutations'
import { PROFILE } from '../../graphql/queries'
// import { AuthContext } from '../../context/authContext'
import UserProfile from '../../components/forms/UserProfile'
import FileUpload from '../../components/FileUpload'

export default function Profile() {
    // const {state} = useContext(AuthContext);
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
    
return (
    <div className="container p-5">
        <div className="row">
            <div className="col-md-12 pb-3">
            { loading ? 
                <h4 className="text-danger">Loading...</h4> : 
                <h4>Profile</h4>
            }
            </div>
            <FileUpload 
                values={values}
                loading={loading}
                setValues={setValues}
                setLoading={setLoading}    
            />
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
