import React, { ReactNode } from 'react';
import Row from 'react-bootstrap/Row';
import NavBar from '../components/navbar';

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="container text-center">
      <NavBar />
      <Row>
        <div className="col order-first"><a></a></div>
        <div className="col">
          <div className="mt-2 mb-5">Home</div>
        </div>
        <div className="col order-last"><a>Notes & Events</a></div>
      </Row>
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
