import React from "react"
import { useAuth } from "../hooks/authProvider";
import {fastapiclient} from '../client.js';
import Router from "next/router";
import next from "next";
import Link from 'next/link';

const NavBar = () => {
    const auth = useAuth();
    console.log(auth);
    const router = Router;


    function logout (): void {
        fastapiclient.logout()
        .then( (response) => {
            auth.logOut()
            router.push('/');
            console.log(response)
            window.location.reload()
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
                    <li><Link href='/'>Home</Link></li>
                    <li><Link href='/register'>Register</Link></li>
                    <li><Link href='/login'>Login</Link></li>
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
                    <li><Link href='/'>Home</Link></li>
                    <li><button type='button' onClick={logout}>Logout</button></li>
                    <li><Link href='/add_event'>Add event</Link></li>
                    <li><Link href='/get_events'>See your events</Link></li>
                    <li>Add note</li>
                    <li>See your notes</li>
                </ul>
            </nav>
            </div>
        );
    }
   };


export default NavBar
