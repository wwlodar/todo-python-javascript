import React from "react"
import { NavLink } from 'react-router-dom'
import { useContext, createContext } from "react";
import { useAuth } from "../hooks/authProvider";
import {fastapiclient} from '../client.js';


const NavBar = () => {
    const auth = useAuth();
    console.log(auth);

    function logout () {
        fastapiclient.logout()
        .then( (response) => {
            auth.logOut()
            navigate("/");
            console.log(response)
        })
        .catch( (error) => {
            console.log(error)
        });}

    if (!auth.token) {
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
                    <li><button type='button' onClick={logout}>Logout</button></li>
                    <li><NavLink to='/add_event'>Add event</NavLink></li>
                    <li>See your events</li>
                    <li>Add note</li>
                    <li>See your notes</li>
                </ul>
            </nav>
            </div>
        );
    };
   };


export default NavBar
