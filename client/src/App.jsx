import React, { useContext } from 'react';
import {Routes, Route} from 'react-router-dom'

import Home from './pages/Home/Home'
import Nav from './components/Nav';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import { ToastContainer } from 'react-toastify';
import CompleteRegistration from './pages/auth/CompleteRegistration';
import { AuthContext } from './context/authContext'
import { ApolloClient, createHttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import PrivateRoute from './components/PrivateRoute';
import PasswordUpdate from './pages/auth/PasswordUpdate';
import PasswordForgot from './pages/auth/PasswordForgot';
import Post from './pages/auth/post/post';
import Profile from './pages/auth/Profile';

const App = () => {
  const {state} = useContext(AuthContext);
  const {user} = state;
  
  const httpLink = createHttpLink({
    uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
  });
  const authLink = setContext((_, { headers }) => {
    const token = user ? user.token : '';
    return {
      headers: {
        ...headers,
        authtoken: token,
      }
    }
  });
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
      addTypename: false
    })
  });
  

  return (
    <ApolloProvider client={client}>
      <Nav/>
      <ToastContainer/>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route exact path="/register" element={<Register/>}/>
        <Route exact path="/login" element={<Login/>}/>
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
      </Routes>
    </ApolloProvider>
  );
};

export default App;
