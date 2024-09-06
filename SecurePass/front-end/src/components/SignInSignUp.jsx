import React, { useEffect, useState } from 'react';
import './style.css';
import { Link } from 'react-router-dom';

const SignInSignUp = () => {
  const [signUpData, setSignUpData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
    isAdmin: false,
  });

  useEffect(() => {
    const sign_in_btn = document.querySelector("#sign-in-btn");
    const sign_up_btn = document.querySelector("#sign-up-btn");
    const container1 = document.querySelector(".container1");

    const handleSignUpClick = () => {
      container1.classList.add("sign-up-mode");
    };

    const handleSignInClick = () => {
      container1.classList.remove("sign-up-mode");
    };

    sign_up_btn.addEventListener("click", handleSignUpClick);
    sign_in_btn.addEventListener("click", handleSignInClick);

    return () => {
      sign_up_btn.removeEventListener("click", handleSignUpClick);
      sign_in_btn.removeEventListener("click", handleSignInClick);
    };
  }, []);

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData({
      ...signUpData,
      [name]: value,
    });
  };

  const handleSignInChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignInData({
      ...signInData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (signUpData.password !== signUpData.confirmPassword) {
      window.alert('Passwords do not match');
    } else {
      const { username, email, password } = signUpData;
      const signUpPayload = { username, email, password };

      try {
        const response = await fetch('http://localhost:3000/sign-up', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signUpPayload),
        });

        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          const result = await response.json();
          localStorage.setItem("UserData", JSON.stringify(result));
          // Redirect after successful sign-up
          window.location.href = "http://localhost:5173";
        } else {
          const responseText = await response.text();
          throw new Error('Server did not return JSON');
        }
      } catch (error) {
        window.alert('Error signing up. Please try again.');
      }
    }
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signInData),
      });

      const result = await response.json();
      if (result.success && result.email === "securepassss@gmail.com" && result.password === "Secure@Pass231544") {
        localStorage.clear();
        localStorage.setItem("admin", JSON.stringify(result));
        window.location.href = "http://localhost:5173/dashboard";
      } else if (result.success) {
        localStorage.clear();
        localStorage.setItem("UserData", JSON.stringify(result));
        window.location.href = "http://localhost:5173/";
      } else {
        window.alert(result.message);
      }
    } catch (error) {
      window.alert('Error signing in. Please try again.');
    }
  };

  return (
    <div className="container1">
      <div className="forms-container">
        <div className="signin-signup">
          <form action="/sign-in" className="sign-in-form" onSubmit={handleSignInSubmit}>
            <h2 className="title">Sign in</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input type="email" name="email" placeholder="Email" required onChange={handleSignInChange} />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input type="password" name="password" placeholder="Password" required onChange={handleSignInChange} />
            </div>
            <div className='input-field-check'>
              <input type="checkbox" name="isAdmin" id="isAdmin" onChange={handleSignInChange} /> IS ADMIN
            </div>
            <Link to="/forgot-password">Forgot Password?</Link>
            <input type="submit" value="Login" className="btn solid" />
          </form>
          <form action="/sign-up" className="sign-up-form" onSubmit={handleSignUpSubmit}>
            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input type="text" name="username" placeholder="Username" required onChange={handleSignUpChange} />
            </div>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input type="email" name="email" placeholder="Email" required onChange={handleSignUpChange} />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input type="password" name="password" placeholder="Password" required onChange={handleSignUpChange} />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input type="password" name="confirmPassword" placeholder="Confirm Password" required onChange={handleSignUpChange} />
            </div>
            <input type="submit" className="btn" value="Sign up" />
          </form>
        </div>
      </div>
      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3 className='font-bold'>New here?</h3>
            <p className='font-bold text-4xl'>Enter your personal details and start your journey with us</p>
            <button className="btn transparent" id="sign-up-btn">Sign up</button>
          </div>
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3 className='font-bold'>One of us?</h3>
            <p className='font-bold text-4xl'>To keep connected with us please Sign-in with your personal info</p>
            <button className="btn transparent" id="sign-in-btn">Sign in</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInSignUp;
