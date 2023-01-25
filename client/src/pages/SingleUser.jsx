import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { PUBLIC_PROFILE } from '../graphql/queries'
import { useParams } from 'react-router-dom'
import UserCard from '../components/UserCard'

export default function SingleUser() {

    let { username } = useParams();

    const {loading, data} = useQuery(PUBLIC_PROFILE, {
        variables:{username}
    })

  if (loading) return <p className="p-5">Loading...</p>;
  return (
    <div className='container'>
        <br />
        <UserCard user={data.publicProfile}/>
    </div>
  )
}
