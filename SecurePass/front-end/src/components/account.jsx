import React from 'react';
import { Link } from 'react-router-dom';

const Account = () => {
  // Get data from local storage
  const userData = JSON.parse(localStorage.getItem('UserData'));

  // Mask the password
  const maskedPassword = userData?.password ? '*'.repeat(userData.password.length) : '';

  return (
    <div className="bg-slate-300 h-[calc(100vh-126px)] flex justify-center">
      <div className=" p-8 rounded-lg  text-center mt-8 h-1/2">
        <h2 className="md:text-4xl font-bold mb-4 text-green-700 text-2xl">Account Details</h2>
        <table className="table-auto w-full text-left">
          <tbody>
            <tr className='md:text-3xl'>
              <td className="font-bold px-4 py-2">Username:</td>
              <td className="px-4 py-2">{userData?.user}</td>
            </tr>
            <tr className='md:text-3xl'>
              <td className="font-bold px-4 py-2">Email:</td>
              <td className="px-4 py-2">{userData?.email}</td>
            </tr>
            <tr className='md:text-3xl'>
              <td className="font-bold px-4 py-2">Password:</td>
              <td className="px-4 py-2">{maskedPassword}</td>
            </tr>
          </tbody>
        </table>
        <div className="mt-6">
          <Link
            to="/edit-account"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
          >
            Edit
          </Link>
          <Link
            to="/delete-account"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Account;
