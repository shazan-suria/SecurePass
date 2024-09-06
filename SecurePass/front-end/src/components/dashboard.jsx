import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const [userArray, setUserArray] = useState([]);
    const [accessGranted, setAccessGranted] = useState(false);

    const getUsers = async () => {
        try {
            let req = await fetch("http://localhost:3000/dashboard");
            let user_info = await req.json();
            setUserArray(user_info);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        }
    };

    useEffect(() => {
        // Check localStorage for authentication data
        const storedData = localStorage.getItem('admin');
        if (storedData) {
            const { email, password } = JSON.parse(storedData);
            if (email === "securepassss@gmail.com" && password === "Secure@Pass231544") {
                setAccessGranted(true);
                getUsers();
            } else {
                setAccessGranted(false);
            }
        } else {
            setAccessGranted(false);
        }
    }, []);

    return (
        <>
            {accessGranted ? (
                <>
                    <h2 className='font-bold py-4 text-2xl text-center text-green-700'>Your Users</h2>
                    {userArray.length === 0 && <div>No users to show</div>}
                    {userArray.length !== 0 && (
                        <table className="table-auto w-full rounded-md overflow-hidden">
                            <thead className='text-green-600 bg-gray-800'>
                                <tr>
                                    <th className='py-2'>Username</th>
                                    <th className='py-2'>Email</th>
                                </tr>
                            </thead>
                            <tbody className='bg-gray-100 text-green-600'>
                                {userArray.map((item, index) => (
                                    <tr key={index}>
                                        <td className='text-center py-3 border border-white'>
                                            <div className='flex justify-center items-center'>
                                                {item.username}
                                            </div>
                                        </td>
                                        <td className='text-center py-3 border border-white'>
                                            <div className='flex justify-center items-center'>
                                                {item.email}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            ) : (
                <div className='text-center text-red-600 font-bold'>Access Denied</div>
            )}
        </>
    );
};

export default Dashboard;
