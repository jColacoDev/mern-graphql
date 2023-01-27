import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'


export default function Search() {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if(query) navigate(`/search/${query}`)
    }

    return (
        <form onSubmit={handleSubmit}
            className="form-inline my-2 my-lg-0"
        >
            <input onChange={(e)=>setQuery(e.target.value)}
                type="search" 
                aria-label="Search"
                placeholder="Search" 
                value={query}
                className="form-control mr-sm-2" 
            />
            <button 
                disabled={!query}
                type="submit"
                className="btn btn-outline-success my-2 my-sm-0" 
            >Search</button>
        </form>
    )
}
