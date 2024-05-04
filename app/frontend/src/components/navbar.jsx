import React from "react"
import { NavLink } from 'react-router-dom'

const NavBar = () => {
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
   };


export default NavBar
