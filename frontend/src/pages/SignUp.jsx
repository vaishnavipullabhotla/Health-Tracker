import React from 'react';
import Navbar from '../components/navigation/Navbar';
import SignUpForm from '../components/auth/SignUpForm';
import '../styles/components/signup.css';

const SignUp = () => {
  return (
    <div className="signup-page">
      <Navbar showLinks={false} />
      <div className="signup-container">
        <img
          src="/assets/images/signup.jpg"
          alt="Sign Up Illustration"
          className="signup-illustration"
        />
        <div className="signup-form-wrapper">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};

export default SignUp;