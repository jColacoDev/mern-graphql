import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_USERS } from '../graphql/queries';
import UserCard from '../components/UserCard';


const Users = () => {
  const { data, loading, error } = useQuery(GET_ALL_USERS);

  if (loading) return <p className="p-5">Loading...</p>;
  return (
    <div className="container">
      <div className="row p-5">
        {data &&
          data.allUsers.map(user => (
            <div className="col-md-4" key={user._id}>
                <UserCard user={user}/>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
