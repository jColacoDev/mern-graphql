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
    cache: new InMemoryCache()
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
      </Routes>
    </ApolloProvider>
  );
};

export default App;
