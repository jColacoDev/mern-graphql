import React, {useContext, useState} from 'react';
import { useQuery, useLazyQuery, useSubscription } from '@apollo/client';
import { AuthContext } from '../../context/authContext';
import { useNavigate } from "react-router-dom";
import PostCard from '../../components/PostCard';
import PostPagination from '../../components/PostPagination';
import { GET_ALL_POSTS, TOTAL_POSTS } from '../../graphql/queries';
import { POST_CREATED, POST_UPDATED, POST_DELETED } from '../../graphql/subscriptions';
import { toast } from 'react-toastify'

function update(arr, _id, updatedData) {
  return arr.map((item) =>
    item._id === _id ? { ...item, ...updatedData } : item
  )
}

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

  const {data: postCreated} = useSubscription(POST_CREATED, {
    onData: async ({
      client: {cache}, 
      data: {data}
    }) => {
      const {allPosts} = cache.readQuery({
        query: GET_ALL_POSTS,
        variables: { perPage, page }
      })
      cache.writeQuery({
        query: GET_ALL_POSTS,
        variables: { perPage, page },
        data: {
          allPosts: [data.postCreated, ...allPosts.slice(0, perPage -1)]
        }
      })
      fetchPosts({
        variables: {perPage, page},
        // refetchQueries: [{query: GET_ALL_POSTS}]
        refetchQueries: [{query: GET_ALL_POSTS, variables: {perPage, page}}]
      })
      toast.success('Post Created!');
    }
  })
  const {data: postUpdated} = useSubscription(POST_UPDATED, {
    onData: async({
      client: {cache}, 
      data: {data}
    }) => {
      console.log(data.postUpdated)
      
      const {allPosts} = cache.readQuery({
        query: GET_ALL_POSTS,
        variables: { perPage, page }
      })
      
      cache.writeQuery({
        query: GET_ALL_POSTS,
        variables: { perPage, page },
        data: {
          allPosts: update(allPosts, data.postUpdated._id, data.postUpdated)
        }
      })
      
      toast.success('Post Updated!');
    }
  });
  const {data: postDeleted} = useSubscription(POST_DELETED, {
    onData: async ({
      client: {cache}, 
      data: {data}
    }) => {
      const {allPosts} = cache.readQuery({
        query: GET_ALL_POSTS,
        variables: { perPage, page }
      })
      cache.writeQuery({
        query: GET_ALL_POSTS,
        variables: { perPage, page },
        data: {
          allPosts: allPosts.filter((post)=>post?._id !== data.postDeleted?._id)
        }
      })
      fetchPosts({
        variables: {page},
        // refetchQueries: [{query: GET_ALL_POSTS}]
        refetchQueries: [{query: GET_ALL_POSTS, variables: {perPage, page}}]
      })
      toast.error('Post Deleted!');
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
      {JSON.stringify(postUpdated)}
      <hr />
      {JSON.stringify(state.user)}
      <hr />
      {JSON.stringify(navigateTo)}
    </div>
  );
};

export default Home;
