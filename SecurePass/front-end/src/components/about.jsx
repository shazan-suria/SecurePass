import React from 'react'
import Navbar from './Navbar'
const about = () => {
  return (
    <>
      <div className='text-5xl text-center mt-8 font-bold'>
        <h1 >Welcom to <span className='text-green-700'>&lt;</span><span>Secure</span><span className='text-green-700'>Pass/&gt;</span></h1>
        <h2 className='text-green-700 mt-5'>About Our Password Manager</h2>
      </div>
      <div className='text-center w-3/4 m-auto mt-10 mb-0 text-3xl'>
        <p className='text-center text-gray-700 mb-0'>In today's digital age, safeguarding your online accounts is more crucial than ever. Our password manager is designed to provide you with a secure and convenient way to manage your passwords across all your devices. With a user-friendly interface, you can easily store, organize, and retrieve your passwords, ensuring that your sensitive information remains protected. Each user's data is securely stored in an individualized collection, uniquely identified by a self-generated ID. We prioritize your privacy and security, employing advanced encryption methods to keep your credentials safe from unauthorized access. Whether you're managing personal accounts or business credentials, our password manager is your trusted companion for digital security.</p>
      </div>
    </>
  )
}

export default about
