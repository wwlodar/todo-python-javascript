import React, { ReactNode } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavBar from '../components/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

type LayoutProps = {
  children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="container-fluid">
      <Row style={{ backgroundColor: '#f8d7da', color: '#721c24' }} className="py-3 shadow-sm">
        <Col>
          <h1 className="mb-0 ps-3">Notes & Events App</h1>
        </Col>
      </Row>
      <Row className="flex-nowrap">
        <Col xs={12} md={3} lg={2} className="bg-light min-vh-100 p-3">
          <NavBar />
        </Col>

        <Col xs={12} md={9} lg={10} className="p-4">
          <main>{children}</main>
        </Col>
      </Row>
    </div>
  );
};

export default Layout;
