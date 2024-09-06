import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import About from './components/about';
import Contact from './components/contact';
import Login from './components/SignInSignUp';
import Manager from './components/Manager';
import Footer from './components/Footer';
import Dashboard from './components/dashboard';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword'; 
import Account from './components/account';
import EditAccount from './components/EditAccount';
import DeleteAccount from './components/DeleteAccount';

const App = () => {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>

          <Route path='/' element=<div className='min-h-[calc(100vh-126px)] bg-slate-50'>{<Manager />}</div> />
          <Route path='/dashboard' element=<div className='min-h-[calc(100vh-126px)] bg-slate-50'>{<Dashboard />}</div> />
          <Route path="/about" element=<div className='min-h-[calc(100vh-126px)] bg-slate-50'>{<About />}</div> />
          <Route path="/contact" element=<div className='min-h-[calc(100vh-126px)] bg-slate-50'>{<Contact />}</div> />
          <Route path="/SignInSignUp" element=<div className='min-h-[calc(100vh-126px)]'>{<Login />}</div> />
          <Route path='/forgot-password' element=<div className='min-h-[calc(100vh-126px)]'>{<ForgotPassword />}</div> />
          <Route path='/reset-password/:token' element=<div className='min-h-[calc(100vh-126px)]'>{<ResetPassword />}</div> />
          <Route path='/account' element=<div className='min-h-[calc(100vh-126px)]'>{<Account />}</div> />
          <Route path='/edit-account' element=<div className='min-h-[calc(100vh-126px)]'>{<EditAccount />}</div> />
          <Route path='/delete-account' element=<div className='min-h-[calc(100vh-126px)]'>{<DeleteAccount />}</div> />

        </Routes>
        <Footer />
      </Router>
    </>
  );
};

export default App;
