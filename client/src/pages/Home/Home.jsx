import React, {useContext, useState} from 'react';
import { useQuery, useLazyQuery, useSubscription } from '@apollo/client';
import { AuthContext } from '../../context/authContext';
import { useNavigate } from "react-router-dom";
import PostCard from '../../components/PostCard';
import PostPagination from '../../components/PostPagination';
import { GET_ALL_POSTS, TOTAL_POSTS } from '../../graphql/queries';
import { POST_ADDED } from '../../graphql/subscriptions';
import { toast } from 'react-toastify'

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

  const {data: newPost} = useSubscription(POST_ADDED, {
    onSubscriptionData: async ({
      client: {cache}, 
      subscriptionData: {data}
    }) => {
      const {allPosts} = cache.readQuery({
        query: GET_ALL_POSTS,
        variables: { perPage, page }
      })
      cache.writeQuery({
        query: GET_ALL_POSTS,
        variables: { perPage, page },
        data: {
          allPosts: [data.postAdded, ...allPosts]
        }
      })
      fetchPosts({
        variables: {page},
        refetchQueries: [{query: GET_ALL_POSTS, variables: {perPage, page}}]
      })
      toast.success('New post!');
    }
  })

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
      {JSON.stringify(newPost)}
      <hr />
      {JSON.stringify(state.user)}
      <hr />
      {JSON.stringify(navigateTo)}
    </div>
  );
};

export default Home;
