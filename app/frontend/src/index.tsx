import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

import Layout from "./pages/layout";
import Home from "./pages/home";
import Register from "./pages/register";
import Login from "./pages/login";

import AddEvent from "./pages/add_event";
import EventList from './pages/get_events';
import GetEvent from "./pages/get_event";

import AuthProvider from './hooks/authProvider';
import PrivateRoute from "./router/route";

import NotFound from "./pages/not_found";

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>

          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="*" element={<Home />} />

            <Route element={<PrivateRoute />}>
              <Route path="event/:id" element={<GetEvent />} />
              <Route path="add_event" element={<AddEvent />} />
              <Route path="get_events" element={<EventList />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);

reportWebVitals();
