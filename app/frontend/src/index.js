import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

// Users
import Layout from "./pages/layout/index";
import Home from "./pages/home/index";
import Register from "./pages/register/index";
import Login from "./pages/login/index";

// Events
import AddEvent from "./pages/add_event/index";
import EventList from './pages/get_events';
import GetEvent from "./pages/get_event/index";

// Notes
import NavBar from "./components/navbar"
import AuthProvider from './hooks/authProvider';
import PrivateRoute from "./router/route";

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
            <Route path="event/:id" element={<GetEvent/>}/>
            <Route path="add_event" element={<AddEvent/>}/>
            <Route path="get_events" element={<EventList/>} />
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
