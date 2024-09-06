import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();  // Use useParams to get the token from the URL
  const [newPassword, setNewPassword] = useState({
    password: '',
    confirmPassword: ''
  });

  // Check if UserData exists in local storage

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPassword({
      ...newPassword,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (newPassword.password !== newPassword.confirmPassword) {
        window.alert('Passwords do not match');
      } else {  
        await axios.post(`http://localhost:3000/reset-password/${token}`, { newPassword });
        window.alert("Password has been reset successfully");
        window.location.href = "http://localhost:5173/SignInSignUp";
      }
    } catch (error) {
      window.alert(error.response.data);
    }
  };

  return (
    <div className='bg-slate-600 flex flex-col items-center h-screen'>
        <div className='flex flex-col items-center bg-slate-200 mt-28 border rounded-md md:w-1/2'>
          <h2 className='p-4 mt-4 font-bold text-green-700 text-2xl md:text-3xl md:m-6'>Reset Your Password</h2>
          <form onSubmit={handleSubmit}>
            <input
              className='border rounded-full w-5/6 text-sm p-1 md:text-2xl md:p-2 m-2 md:w-full'
              type="password"
              name='password'
              placeholder="Enter new password"
              onChange={handleChange}
              required
            />
            <input
              className='border rounded-full w-5/6 text-sm p-1 md:text-2xl md:p-2 m-2 md:w-full'
              type="password"
              name='confirmPassword'
              placeholder="Confirm new password"
              onChange={handleChange}
              required
            />
            <button type="submit" className='bg-green-600 m-4 px-5 py-2 text border rounded-full border-green-600 md:text-2xl'>Reset</button>
          </form>
        </div>
    </div>
  );
};

export default ResetPassword;
