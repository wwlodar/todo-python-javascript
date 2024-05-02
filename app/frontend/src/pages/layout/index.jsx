import {useState, useEffect} from "react";
import {Outlet, Link, useNavigate} from "react-router-dom";
import {fastapiclient, GetEventById} from '../../client'
import InputForm from '../../components/InputForm'
import NavBar from '../../components/navbar'
import Row from 'react-bootstrap/Row';


const Layout =({children}) =>{
  return(
      <>
      <div className="container text-center">
  <Row>

    <div class="col order-first">
      <a>DUPA</a>
    </div>

    <div class="col">
      <div class="mt-2 mb-5">DUPA 2 </div>
    </div>

    <div class="col order-last">
      <a>DUPA 3</a>
    </div>

  </Row>
  <main>{children}</main>

  </div>
      </>
  )
}

export default Layout;