import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import Layout from "./pages/layout/index";
import Home from "./pages/home/index";
import Event from "./pages/event/index";
import Register from "./pages/register/index";
import NavBar from "./components/navbar"

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById("root"));

export default function App() {
  return (
    <Router>
      <NavBar/>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="event/:id" element={<Event/>}/>
          <Route path="register/" element={<Register/>}/>
      </Routes>
      </Router>
  );
}

root.render(
  <Layout>
    <App />
  </Layout>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
reportWebVitals();
