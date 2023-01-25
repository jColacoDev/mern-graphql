import React from 'react'

export default function UserProfile({
    handleSubmit,
    handleChange,
    username,
    email,
    about,
    loading
}) {
  return (
    <form onSubmit={handleSubmit}>
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
  )
}
