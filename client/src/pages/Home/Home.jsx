import React, {useContext} from 'react';
import { useQuery, useLazyQuery, gql } from '@apollo/client';
import { AuthContext } from '../../context/authContext';
import { useNavigate } from "react-router-dom";

const GET_ALL_POSTS = gql`
  query {
    allPosts {
      id
      title
      description
    }
  }
`;

const Home = () => {
  let navigateTo = useNavigate();
  const {state, dispatch} = useContext(AuthContext);
  const { data, loading, error } = useQuery(GET_ALL_POSTS);

  const [fetchPosts, {data: postsData}] = useLazyQuery(GET_ALL_POSTS);
  

const updateUserName = () => {
  dispatch({
    type: 'LOGGED_IN_USER',
    payload: 'jColaco'
  })
}

  if (loading) return <p className="p-5">Loading...</p>;
  return (
    <div className="container">
      <div className="row p-5">
        {data &&
          data.allPosts.map(p => (
          <div className="col-md-4" key={p.id}>
            <div className="card">
              <div className="card-body">
                <div className="card-title">
                  <h4>{p.title}</h4>
                </div>
                <p className="card-text">{p.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="row p-5">
        <button onClick={()=>fetchPosts()} 
          className="btn-raised btn-primary">
            Fetch posts
        </button>
      </div>
      <hr />
      {JSON.stringify(postsData)}
      <hr />
      {JSON.stringify(state.user)}
      <hr />
      <button onClick={updateUserName} className="btn btn-primary">
        Change user name
      </button>
      <hr />
      {JSON.stringify(navigateTo)}
    </div>
  );
};

export default Home;
