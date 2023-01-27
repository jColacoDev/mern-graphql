import React from 'react'
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom'
import { SEARCH } from '../graphql/queries';
import PostCard from './PostCard';

export default function SearchResults() {
    const {query} = useParams();
    const {data, loading} = useQuery(SEARCH, {
        variables: {query}
    })
    
    if(loading) 
    return <div className="container text-center">
        <p className="text-danger p-5">
            Loading...
        </p>
    </div>
    
    if(!data.search.length) 
    return <div className="container text-center">
        <p className="text-danger p-5">
            No results
        </p>
    </div>

    return (
        <div className="container">
            <div className="row pb-5">
                {data.search.map((post)=>
                    <div key={post._id} className="col-md-4 pt-5">
                        <PostCard post={post} />
                    </div>
                )}
            </div>
        </div>
    )
}
