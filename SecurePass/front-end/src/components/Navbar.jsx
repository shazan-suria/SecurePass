import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-gray-800 p-4">
            <div className="mycontainer flex justify-between items-center px-4 py-5 h-12">
                <div className="logo font-bold text-white text-2xl">
                    <span className='text-green-700'>&lt;</span>
                    <span>Secure</span>
                    <span className='text-green-700'>Pass/&gt;</span>
                </div>
                <div className="hidden md:flex gap-4">
                    <li className="text-white transition-all hover:text-green-700 font-bold list-none"><Link to="/">Home</Link></li>
                    <li className="text-white transition-all hover:text-green-700 font-bold list-none"><Link to="/about">About</Link></li>
                    <li className="text-white transition-all hover:text-green-700 font-bold list-none"><Link to="/contact">Contact</Link></li>
                    <li className="text-white transition-all hover:text-green-700 font-bold list-none"><Link to="/SignInSignUp">Sign-in</Link></li>
                </div>
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-white focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
                        </svg>
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden">
                    <ul className="flex flex-col gap-4 p-4 bg-gray-800">
                        <li className="text-white hover:text-green-700 font-bold"><Link to="/" onClick={toggleMenu}>Home</Link></li>
                        <li className="text-white hover:text-green-700 font-bold"><Link to="/about" onClick={toggleMenu}>About</Link></li>
                        <li className="text-white hover:text-green-700 font-bold"><Link to="/contact" onClick={toggleMenu}>Contact</Link></li>
                        <li className="text-white hover:text-green-700 font-bold"><Link to="/SignInSignUp" onClick={toggleMenu}>Sign-in</Link></li>
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
