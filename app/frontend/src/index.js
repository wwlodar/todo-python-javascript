import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import Layout from "./pages/layout/index";
import Home from "./pages/home/index";
import Event from "./pages/event/index";
import Register from "./pages/register/index";
import Login from "./pages/login/index";
import NavBar from "./components/navbar"
import AuthProvider from './hooks/authProvider';
import PrivateRoute from "./router/route";
import AddEvent from "./pages/add_event/index";


import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById("root"));


export default function App() {
  return (
    <Router>
      <AuthProvider>
      <NavBar/>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="register/" element={<Register/>}/>
          <Route path="login/" element={<Login/>}/>
          <Route element={<PrivateRoute />}>
            <Route path="event/:id" element={<Event/>}/>
            <Route path="add_event" element={<AddEvent/>}/>
          </Route>
      </Routes>
      </AuthProvider>
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
