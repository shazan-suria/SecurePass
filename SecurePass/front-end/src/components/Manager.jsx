import React, { useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import Account from './account';

const Manager = () => {
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(true); // Add a state to track sign-in status
  const ref = useRef();
  const passwordRef = useRef();
  const [collection, setCollection] = useState("");

  useEffect(() => {
    const handleTabClose = () => {
      localStorage.clear();
    };

    window.addEventListener('beforeunload', handleTabClose);

    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('UserData'));
    if (userData) {
      setCollection(userData.collection); // Set collection name
      getPasswords(userData.collection);
    } else {
      setIsSignedIn(false);
    }
  }, []);

  const getPasswords = async (collection) => {
    try {
      let req = await fetch(`http://localhost:3000/?collection=${collection}`);
      let passwords = await req.json();

      if (passwords) {
        setPasswordArray(passwords);
      }
    } catch (error) {
      toast.error("Error fetching passwords: " + error.message);
    }
  };

  const copyText = (text) => {
    toast("Copy to Clipboard!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

    navigator.clipboard.writeText(text);
  };

  const showPassword = () => {
    passwordRef.current.type = "text";
    if (ref.current.src.includes("icons/eyecross.png")) {
      passwordRef.current.type = "password";
      ref.current.src = "icons/eye.png";
    } else {
      ref.current.src = "icons/eyecross.png";
      passwordRef.current.type = "text";
    }
  };

  const savePassword = async () => {
    if (form.site.length > 3 && form.password.length > 3 && form.username.length > 3) {
      if (form.id) {
        await fetch(`http://localhost:3000/${form.id}?collection=${collection}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
      }
      const newPassword = { ...form, id: uuidv4() }; // Generate UUID once

      try {
        let res = await fetch(`http://localhost:3000/?collection=${collection}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPassword),
        });

        if (res.ok) {
          setPasswordArray([...passwordArray, newPassword]); // Only update state after successful POST
          toast("Password Saved", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          toast("Error saving password", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      } catch (error) {
        toast("Error saving password: " + error.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } finally {
        setForm({ site: "", username: "", password: "" });
      }
    } else {
      toast("Input is too short", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };


  const deletePassword = async (id) => {
    let confirmDelete = window.confirm("Do you want to delete password?");
    if (confirmDelete) {
      try {
        let res = await fetch(`http://localhost:3000/${id}?collection=${collection}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (res.ok) {
          setPasswordArray(passwordArray.filter(item => item.id !== id));
          toast("Password Deleted", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          return; // Exit loop on success
        } else {
          console.log('Delete attempt failed, retrying...', i + 1);
        }
        toast.error("Error deleting password after multiple attempts");
      } catch (error) {
        toast.error("Error deleting password: " + error.message);
      }
    }
  };

  const editPassword = (id) => {
    setForm({ ...passwordArray.find(i => i.id === id), id: id });
    setPasswordArray(passwordArray.filter(item => item.id !== id));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <div className="p-2 mf:px-0 md:mycontainer ">

        <div className="logo font-bold text-4xl text-center">
          <span className='text-green-700'>&lt;</span>
          <span>Secure</span>
          <span className='text-green-700'>Pass/&gt;</span>
        </div>

        <p className='text-green-900 text-3xl text-center'>Your own Password Manager</p>

        {isSignedIn ? (

          <div className="flex flex-col text-black p-4 gap-3 justify-between items-center">
            <div className="account fixed top-20 right-3">
            <Link to="/account">
              <lord-icon
                src="https://cdn.lordicon.com/hrjifpbq.json"
                trigger="hover"
                colors="primary:#15803D"
                style={{ "width": "55px", "height": "55px" }}>
              </lord-icon>
            </Link>
            </div>
            <input value={form.site} onChange={handleChange} placeholder='Enter Website url' className='rounded-full border border-green-600 w-full p-4 py-1' type="text" name="site" id="input-site" />

            <div className="flex flex-col gap-5 w-full md:flex-row">
              <input value={form.username} onChange={handleChange} placeholder='Enter username' className='rounded-full border border-green-600 w-full text-black p-4 py-1' type="text" name="username" id="input-user" />
              <div className="relative">
                <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter Password' className='rounded-full border border-green-600 w-full text-black p-4 py-1' type="password" name="password" id="inout-pass" />
                <span className='absolute right-5 top-[2px] cursor-pointer' onClick={showPassword}>
                  <img ref={ref} className='py-2' width={20} src="icons/eye.png" alt="" />
                </span>
              </div>
            </div>
            <button onClick={savePassword} className='flex justify-center items-center bg-green-500 p-2 px-4 gap-2 m-2 w-fit rounded-full hover:bg-green-400 '>
              <lord-icon
                src="https://cdn.lordicon.com/jgnvfzqg.json"
                trigger="hover">
              </lord-icon> Save Password
            </button>
          </div>
        ) : (
          <div className="text-center text-red-500 text-2xl p-4">
            Continue by Sign-in
          </div>
        )}

        {isSignedIn && (
          <div className="passwords">
            <h2 className='font-bold py-4 text-2xl'>Your passwords</h2>
            {passwordArray.length === 0 && <div>No Passwords to show</div>}
            {passwordArray.length !== 0 && (
              <table className="table-auto w-full rounded-md overflow-hidden">
                <thead className=' text-green-600 bg-gray-800'>
                  <tr>
                    <th className='py-2'>Site</th>
                    <th className='py-2'>Username</th>
                    <th className='py-2'>Password</th>
                    <th className='py-2'>Actions</th>
                  </tr>
                </thead>
                <tbody className='bg-gray-100 text-green-600'>
                  {passwordArray.map((item, index) => (
                    <tr key={index}>
                      <td className='text-center py-3 border border-white'>
                        <div className='flex justify-center items-center'>
                          <a href={item.site} target='_blank'>{item.site}</a>
                          <div className='cursor-pointer lordiconcopy' onClick={() => { copyText(item.site) }}>
                            <lord-icon className='mt-4 h-2 cursor-pointer'
                              src="https://cdn.lordicon.com/wzwygmng.json"
                              trigger="hover"
                              colors="primary:#15803D,secondary:#15803D"
                              style={{ "width": "25px", "height": "25px" }}>
                            </lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className='text-center py-3 border border-white'>
                        <div className='flex justify-center items-center'>
                          {item.username}
                          <div className='cursor-pointer lordiconcopy' onClick={() => { copyText(item.username) }}>
                            <lord-icon className='mt-4 h-2 cursor-pointer'
                              src="https://cdn.lordicon.com/wzwygmng.json"
                              trigger="hover"
                              colors="primary:#15803D,secondary:#15803D"
                              style={{ "width": "25px", "height": "25px" }}>
                            </lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className='text-center py-3 border border-white'>
                        <div className='flex justify-center items-center'>
                          {"*".repeat(item.password.length)}
                          <div className='cursor-pointer lordiconcopy' onClick={() => { copyText(item.password) }}>
                            <lord-icon className='mt-4 h-2 cursor-pointer'
                              src="https://cdn.lordicon.com/wzwygmng.json"
                              trigger="hover"
                              colors="primary:#15803D,secondary:#15803D"
                              style={{ "width": "25px", "height": "25px" }}>
                            </lord-icon>
                          </div>
                        </div>
                      </td>
                      <td className='text-center py-3 border border-white'>
                        <span className='cursor-pointer' onClick={() => { editPassword(item.id) }}>
                          <lord-icon
                            src="https://cdn.lordicon.com/wuvorxbv.json"
                            trigger="hover"
                            colors="primary:#15803D,secondary:#15803D"
                            style={{ "width": "25px", "height": "25px" }}>
                          </lord-icon>
                        </span>
                        <span className='cursor-pointer' onClick={() => { deletePassword(item.id) }}>
                          <lord-icon
                            src="https://cdn.lordicon.com/drxwpfop.json"
                            trigger="hover"
                            colors="primary:#15803D,secondary:#15803D"
                            style={{ "width": "25px", "height": "25px" }}>
                          </lord-icon>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Manager;