import React from 'react';
import {Routes, Route} from 'react-router-dom'

import Home from './pages/Home/Home'
import Nav from './components/Nav';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';

const App = () => {
  return (
    <>
      <Nav/>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route exact path="/register" element={<Register/>}/>
        <Route exact path="/login" element={<Login/>}/>
      </Routes>
    </>
  );
};

export default App;
