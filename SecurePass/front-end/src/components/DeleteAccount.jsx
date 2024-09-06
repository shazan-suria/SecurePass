import React, { useState } from 'react';

const DeleteAccount = () => {
  const [password, setPassword] = useState('');

  const handleDelete = async (e) => {
    e.preventDefault();

    // Retrieve data from local storage
    const userData = JSON.parse(localStorage.getItem('UserData'));
    if (!userData) {
      alert('Sign -in to delete account');
      return;
    }

    const { email, collection } = userData;

    // Check if the input password matches the one in local storage
    if (password !== userData.password) {
      alert('Incorrect password.');
      return;
    }

    // Send the collection and email to the backend to delete the account
    try {
      const response = await fetch('http://localhost:3000/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, collection }),
      });

      if (response.ok) {
        alert('Account deleted successfully.');
        localStorage.removeItem('UserData'); // Remove user data from local storage
        window.location.href = "http://localhost:5173/SignInSignUp";
        // Redirect to another page or perform further actions if needed
      } else {
        alert('Failed to delete account.');
      }
    } catch (error) {
      alert('An error occurred while deleting the account.');
    }
  };

  return (
    <div className='flex justify-center h-[calc(100vh-126px)] bg-slate-700'>
      
      <form onSubmit={handleDelete} className='bg-slate-200 h-96 w-1/2 mt-16 border rounded-2xl'>
      <h1 className='font-bold md:p-10 pt-0 md:text-5xl text-red-700 text-2xl'>Delete Account</h1>
          <input
          className='border rounded-full md:p-3 md:text-2xl text-xl w-1/2 p-1'
          placeholder='Enter your Password'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        <button type="submit"  className='text-xl text-red-700 hover:text-red-500'>Delete Account</button>
      </form>
    </div>
  );
};

export default DeleteAccount;
