import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import InputForm from '../../components/InputForm';
import { useAuth } from "../../hooks/authProvider";
import { fastapiclient } from '../../client';

interface LoginForm {
  email: string;
  password: string;
  username: string;
  confirmPassword: string;
}

interface ErrorState {
  email: string;
  password: string;
  username: string;
  confirmPassword: string;
}

const LoginUser: React.FC = () => {
  const [error, setError] = useState<ErrorState>({ email: '', password: '', username: '', confirmPassword: '' });
  const [backendError, setBackendError] = useState<string | null>(null);
  const [isDisabled, setDisabledState] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginForm>({ email: '', password: '', username: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const auth = useAuth();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
    validateInput(e);
  };

  const validateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setError(prev => {
      const stateObj: ErrorState = { ...prev, [name]: "" };

      switch (name) {
        case "username":
          if (value.length < 4) {
            stateObj.username = "Username is too short";
            setDisabledState(true);
          } else {
            setDisabledState(false);
          }
          break;

        case "password":
          if (!value) {
            stateObj.password = "Please enter Password.";
            setDisabledState(true);
          } else if (value.length < 8) {
            stateObj.password = "Password is too short";
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
  };

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setBackendError(null);
    try {
      const response = await fastapiclient.login(loginForm.username, loginForm.password);
      auth.logIn(response);
      return <Navigate to="/" replace />;
    } catch (err: any) {
      setLoading(false);
      setBackendError(err.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={onLogin}>
      <InputForm
        type="text"
        name="username"
        label="Username"
        required
        error={error.username}
        value={loginForm.username}
        onChange={onInputChange}
      />
      <InputForm
        type="password"
        name="password"
        label="Password"
        required
        error={error.password}
        value={loginForm.password}
        onChange={onInputChange}
      />

      <button
        type="submit"
        disabled={isDisabled || loading}
        className="rounded w-full mt-4 p-1"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      {backendError && <div className="text-danger mt-2">{backendError}</div>}
    </form>
  );
};

export default LoginUser;
