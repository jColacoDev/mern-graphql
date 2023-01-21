import React from 'react'
import { auth } from '../../firebase';


export default function Register() {

    const [email, setEmail] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const config= {
            url: import.meta.env.VITE_CONFIRMATION_EMAIL_REDIRECT,
            handleCodeInApp: true
        }
        await auth.sendSignInLinkToEmail(email, config);

        // show notification

        // save to local storage
        window.localStorage.setItem('emailFormRegistration', email);

        setEmail('');
        setLoading(false);
    }

  return (
    <div className='container'>
        <h4>Register</h4>
        <form onSubmit={handleSubmit}>
            <div className='form-group'>
                <label htmlFor="email">Email Address</label>
                <input type="email" id='email' 
                    value={email} 
                    onChange={(e)=>setEmail(e.target.value)}
                    className="form-control"
                    placeholder='Enter email'
                    disabled={loading}
                />
            </div>
            <button className="btn btn-raised btn-primary"
                disabled={loading || !email}>Submit
            </button>
        </form>
    </div>
  )
}
