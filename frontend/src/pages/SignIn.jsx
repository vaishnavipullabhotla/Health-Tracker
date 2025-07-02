import React from 'react';
import Navbar from '../components/navigation/Navbar';
import SignInForm from '../components/auth/SignInForm';
import '../styles/components/signin.css';

const SignIn = () => {
  return (
    <div className="signin-page">
      <Navbar showLinks={false} />
      <div className="signin-container">
        <SignInForm />
      </div>
    </div>
  );
};

export default SignIn;