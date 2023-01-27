import React, {useContext, useState} from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { AuthContext } from '../../context/authContext';
import { useNavigate } from "react-router-dom";
import { GET_ALL_POSTS, TOTAL_POSTS } from '../../graphql/queries';
import PostCard from '../../components/PostCard';
import PostPagination from '../../components/PostPagination';

const Home = () => {
  let navigateTo = useNavigate();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(3);
  const {state, dispatch} = useContext(AuthContext);
  const { data, loading, error } = useQuery(GET_ALL_POSTS, {
    variables: {
      perPage,
      page
    },
  });
  const {data: postCount} = useQuery(TOTAL_POSTS)
  const [fetchPosts, {data: postsData}] = useLazyQuery(GET_ALL_POSTS);
  let totalPages = Math.ceil(postCount && postCount.totalPosts / perPage);
  

  if (loading) return <p className="p-5">Loading...</p>;
  return (
    <div className="container">
      <div className="row p-5">
        {data &&
          data.allPosts.map((post) => (
            <div className="col-md-4 pt-5" key={post._id}>
              <PostCard post={post} />
            </div>
          ))}
      </div>
      <PostPagination 
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
      <hr />
      {JSON.stringify(postsData)}
      <hr />
      {JSON.stringify(state.user)}
      <hr />
      {JSON.stringify(navigateTo)}
    </div>
  );
};

export default Home;
