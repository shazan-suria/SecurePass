import React, { useState } from 'react';
const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call backend to initiate password reset
    try {
      const response = await fetch('http://localhost:3000/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        alert('Password reset link sent to your email');
      } else {
        alert('Error sending password reset link');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending password reset link');
    }
  };

  return (
    <div className='flex justify-center h-[calc(100vh-126px)] bg-slate-700'>
    <form onSubmit={handleSubmit} className='bg-slate-200 h-96 w-1/2 mt-16 border rounded-2xl'>
      <h1 className='font-bold md:p-10 pt-0 md:text-5xl text-green-700 text-sm'>Forgot Password</h1>
        <input
        className='border rounded-full md:p-3 md:text-2xl text-xs w-3/4 p-0'
        placeholder='Enter your Email'
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />

      <button type="submit" className='text-xs md:text-2xl text-green-700 hover:text-green-600'>Send Reset Link</button>
    </form>
      </div>
  );
};

export default ForgotPassword;
