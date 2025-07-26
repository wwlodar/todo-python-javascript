import React from 'react';
import { Outlet } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import NavBar from '../../components/navbar';

const Layout: React.FC = () => {
  return (
    <div className="container text-center">
      <NavBar />
      <Row>
        <div className="col order-first"><a></a></div>
        <div className="col"><div className="mt-2 mb-5">home</div></div>
        <div className="col order-last"><a>Notes & Events</a></div>
      </Row>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
