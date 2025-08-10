import React from "react";
import { useAuth } from "../hooks/authProvider";
import { fastapiclient } from '../client.js';
import Router from "next/router";
import Link from 'next/link';

const NavBar = () => {
  const auth = useAuth();
  const router = Router;

  const logout = (): void => {
    fastapiclient.logout()
      .then(() => {
        auth.logOut();
        router.push('/');
        window.location.reload();
      })
      .catch(console.error);
  };

  if (!auth.token) {
    return (
      <div className="position-absolute top-10 start-10">
        <h3 className="mb-3">Navigation</h3>
        <nav>
          <ul className="list-unstyled">
            <li className="mb-2"><Link href='/' className="text-reset text-decoration-none">Home</Link></li>
            <li className="mb-2"><Link href='/register' className="text-reset text-decoration-none">Register</Link></li>
            <li className="mb-2"><Link href='/login' className="text-reset text-decoration-none">Login</Link></li>
          </ul>
        </nav>
      </div>
    );
  }

  return (
    <div className="position-absolute top-10 start-10">
      <h3 className="mb-3">Logged in navbar</h3>
      <nav>
        <ul className="list-unstyled">
          <li className="mb-2"><Link href='/' className="text-reset text-decoration-none">Home</Link></li>
          <li className="mb-2"><Link href='/add_event' className="text-reset text-decoration-none">Add event</Link></li>
          <li className="mb-2"><Link href='/get_events' className="text-reset text-decoration-none">See your events</Link></li>
          <li className="mb-2"><Link href='/add_note' className="text-reset text-decoration-none">Add note</Link></li>
          <li className="mb-2"><Link href='/get_notes' className="text-reset text-decoration-none">See your notes</Link></li>
          <li className="mt-3">
            <button
              type='button'
              onClick={logout}
              className="btn btn-dark btn-sm"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
