import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth, googleAuthProvider } from '../../firebase';
import { useMutation } from '@apollo/react-hooks';
import AuthForm from '../../components/forms/AuthForm';
import { USER_CREATE } from '../../graphql/mutations';

const Login = () => {
    const { dispatch } = useContext(AuthContext);
    const [email, setEmail] = useState('joao.r.colaco@gmail.com');
    const [password, setPassword] = useState('qwertyuiop');
    const [loading, setLoading] = useState(false);

    const [userCreate] = useMutation(USER_CREATE);

    let navigate = useNavigate();

    const googleLogin = () => {
        auth.signInWithPopup(googleAuthProvider).then(async (result)=>{
            const {user} = result;
            const idTokenResult = await user.getIdTokenResult();

            dispatch({
                type: 'LOGGED_IN_USER',
                payload: {
                    email: user.email,
                    token: idTokenResult.token
                }
            });

            userCreate();
            navigate('/profile');
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await auth.signInWithEmailAndPassword(email, password).then(async (result) => {
                const { user } = result;
                const idTokenResult = await user.getIdTokenResult();

                dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: { email: user.email, token: idTokenResult.token }
                });

                // send user info to our server mongodb to either update/create
                userCreate();
                navigate('/profile');
            });
        } catch (error) {
            console.log('login error', error);
            toast.error(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="container p-5">
            { loading ? 
                <h4 className="text-danger">Loading...</h4> : 
                <h4>Login</h4>
            }
            <button onClick={googleLogin} 
                className="btn btn-raised btn-danger mt-5"
            >Login with Google</button>
            <AuthForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                loading={loading}
                handleSubmit={handleSubmit}
                showPasswordInput="true"
            />
            <Link className="text-danger float-right" to="/password/forgot">Forgot Password</Link>
        </div>
    );
};

export default Login;
