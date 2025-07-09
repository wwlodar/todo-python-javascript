import React from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';


const Layout =({children}) =>{
  return(
      <>
      <div className="container text-center">
  <Row>

    <div className="col order-first">
      <a></a>
    </div>

    <div className="col">
      <div className="mt-2 mb-5"></div>
    </div>

    <div className="col order-last">
      <a>Notes & Events</a>
    </div>

  </Row>
  <main>{children}</main>

  </div>
      </>
  )
}
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;