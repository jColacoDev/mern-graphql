// React
import React, { useContext } from 'react';
import {Routes, Route} from 'react-router-dom'

// Apollo & gql
import { 
  ApolloClient, 
  InMemoryCache, 
  ApolloProvider,
  split,
  HttpLink
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

// Routes
import Home from './pages/Home/Home'
import Nav from './components/Nav';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import CompleteRegistration from './pages/auth/CompleteRegistration';
import PasswordUpdate from './pages/auth/PasswordUpdate';
import PasswordForgot from './pages/auth/PasswordForgot';
import Post from './pages/auth/post/post';
import Profile from './pages/auth/Profile';
import Users from './pages/Users';
import SingleUser from './pages/SingleUser';
import PostUpdate from './pages/auth/post/PostUpdate';
import SinglePost from './pages/auth/post/SinglePost';
import SearchResults from './components/SearchResults';

// utils
import { ToastContainer } from 'react-toastify';
import { AuthContext } from './context/authContext'
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';


const App = () => {
  const {state} = useContext(AuthContext);
  const {user} = state;
  
  const wsLink = new GraphQLWsLink(createClient({
    url: import.meta.env.VITE_GRAPHQL_WS_ENDPOINT,
    options: {
      shouldRetry: true
    }
  }));
  const httpLink = new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_HTTP_ENDPOINT,
  });
  
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authtoken: user ? user.token : ''
      }
    }
  });
  const httpAuthLink = authLink.concat(httpLink);
  
  const splitLink = split(({query}) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  }, wsLink, httpAuthLink)   

  const apolloClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache({
      addTypename: false
    })
  });

  return (
    <ApolloProvider client={apolloClient}>
      <Nav/>
      <ToastContainer/>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route exact path="/user/:username" element={<SingleUser/>}/>
        <Route exact path="/post/:postid" element={<SinglePost/>}/>
        <Route exact path="/search/:query" element={<SearchResults/>}/>
        <Route exact path="/users" element={<Users/>}/>
        <Route exact path="/complete-registration" element={<CompleteRegistration/>}/>
        <Route exact path="/password/forgot" element={<PasswordForgot/>}/>
        <Route exact path='/password/update' element={<PrivateRoute/>}>
          <Route exact path='/password/update' element={<PasswordUpdate/>}/>
        </Route>
        <Route exact path='/profile' element={<PrivateRoute/>}>
          <Route exact path='/profile' element={<Profile/>}/>
        </Route>
        <Route exact path='/post/create' element={<PrivateRoute/>}>
          <Route exact path='/post/create' element={<Post/>}/>
        </Route>
        <Route exact path='/post/update' element={<PrivateRoute/>}>
          <Route exact path='/post/update/:postid' element={<PostUpdate/>}/>
        </Route>
        <Route exact path='/register' element={<PublicRoute/>}>
          <Route exact path='/register' element={<Register/>}/>
        </Route>
        <Route exact path='/login' element={<PublicRoute/>}>
          <Route exact path='/login' element={<Login/>}/>
        </Route>
      </Routes>
    </ApolloProvider>
  );
};

export default App;
