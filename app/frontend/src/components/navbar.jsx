import React from "react"
import { NavLink } from 'react-router-dom'
import { useContext, createContext } from "react";
import { useAuth } from "../hooks/authProvider";



const NavBar = () => {
    const token = useAuth();
    if (!token) {
        return (
            <div className="position-absolute top-10 start-10">
                <h3>Navigation</h3>
            <nav>
                <ul className="list-unstyled">
                    <li><NavLink to='/'>Home</NavLink></li>
                    <li><NavLink to='/register'>Register</NavLink></li>
                    <li><NavLink to='/login'>Login</NavLink></li>
                </ul>
            </nav>
            </div>
        );
    } else {
        return (
            <div className="position-absolute top-10 start-10">
                <h3>Logged in navbar</h3>
            <nav>
                <ul className="list-unstyled">
                    <li><NavLink to='/'>Home</NavLink></li>
                    <li><NavLink to='/register'>Register</NavLink></li>
                    <li><NavLink to='/logout'>Logout</NavLink></li>
                </ul>
            </nav>
            </div>
        );
    };
   };


export default NavBar
