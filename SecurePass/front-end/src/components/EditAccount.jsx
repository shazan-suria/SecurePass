import React, { useState } from 'react';

const EditAccount = () => {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Get email from localStorage
    const userData = JSON.parse(localStorage.getItem('UserData'));
    const email = userData.email;

    // Prepare the payload
    const payload = { email, newUsername, newPassword };

    try {
      const response = await fetch('http://localhost:3000/edit-account', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        window.alert('Account updated:', data.message);
        const updatedUserData = { ...userData, password: payload.newPassword,user:payload.newUsername};
        localStorage.setItem('UserData', JSON.stringify(updatedUserData));
        window.location.href = "http://localhost:5173/account";
        // Optionally, update localStorage or UI to reflect changes
      } else {
        window.alert('Error:', data.message);
      }
    } catch (error) {
      console.error('Error updating account:', error);
    }
  };

  return (
    <div className='bg-slate-600 flex flex-col items-center h-[calc(100vh-126px)]'>
    <div className='flex flex-col items-center bg-slate-200 mt-28 border rounded-md md:w-1/2'>
      <h2 className='p-4 mt-4 font-bold text-green-700 text-2xl md:text-6xl md:m-6'>Edit Account</h2>
      <form onSubmit={handleSubmit}>
      
        <div>
          <input
          className='border rounded-full w-5/6 text-sm p-1 md:text-2xl md:p-2 m-2 md:w-full'
          required
          placeholder='Edit Username'
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
        </div>
        <div>
          <input
          className='border rounded-full w-5/6 text-sm p-1 md:text-2xl md:p-2 m-2 md:w-full'
          placeholder='Edit Password'
          required
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <input
          className='border rounded-full w-5/6 text-sm p-1 md:text-2xl md:p-2 m-2 md:w-full'
          required
          placeholder='Confirm Username'
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" className='bg-green-600 m-4 px-5 py-2 text border rounded-full border-green-600 md:text-2xl'>Update Account</button>
      </form>
    </div>
    </div>
  );
};

export default EditAccount;
