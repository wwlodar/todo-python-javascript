import React from 'react';
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import InputForm from '../../components/InputForm'
import { useAuth } from "../../hooks/authProvider";
import {fastapiclient} from '../../client';

const LoginUser = () => {
  const [error, setError] = useState({ email: '', password: '', username: '', confirmPassword: '' });
  const [backendError, setBackendError] = useState('');
  let [isDisabled, setDisabledState] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '', username: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const auth = useAuth();


  const onInputChange = e => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
    validateInput(e);
  }

  const validateInput = e => {
    let { name, value } = e.target;
    setError(prev => {
      const stateObj = { ...prev, [name]: "" };

      switch (name) {
        case "username":
          if (value.length < 4) {
            stateObj["username"] = "Username is too short";
            setDisabledState(true);}
          else {
            setDisabledState(false);
          }
          break;

        case "password":
          if (!value) {
            stateObj[name] = "Please enter Password.";
            setDisabledState(true);
          }
            else if (value.length < 8) {
            stateObj["password"] = "Password is too short";
            setDisabledState(true);
          } else {
            setDisabledState(false);
          }
          break;


        default:
          break;
      }

      return stateObj;
    });
  }

  const onLogin = (e) => {
    e.preventDefault();
    setLoading(true)
    fastapiclient.login(loginForm.username, loginForm.password)
    .then( (response) => {
      auth.loginAction(response);
      navigate('/')
    })
    .catch( (err) => {
      setLoading(false)
      setBackendError(err);
    });

  }
  return (
  <form onSubmit={(e) => onLogin(e)}>
         <InputForm
            type={"text"}
            name={"username"}
            label={"Username"}
            required
            error={error.username}
            value={loginForm.username}
            onChange={onInputChange}
          />
          <InputForm
            type={"password"}
            name={"password"}
            label={"Password"}
            required
            error={error.password}
            value={loginForm.password}
            onChange={onInputChange}
          />

        <button title={"Login"} loading={loading} disabled={isDisabled} className={`rounded w-full mt-4 p-1`}>Login</button>
        <div>
        {backendError && <h1>{backendError.message}</h1>}
        </div>

  </form>)}


const Login = () => {
  return (
    <div className="App">
        <h1 className={`mb-4 p-1`}>Login</h1>

      <a><LoginUser /></a>

    </div>
  );
};

export default Login;