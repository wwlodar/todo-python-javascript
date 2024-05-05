import {useState} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import InputForm from '../../components/InputForm'
import { useAuth } from "../../hooks/authProvider";

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
    auth.loginAction(loginForm.username, loginForm.password)
    .then( () => {
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

        <button title={"Login"} error={error} loading={loading} disabled={isDisabled} className={`rounded w-full mt-4 p-1`}>Login</button>
        <div>
        {(backendError !== '') &&
        <h1>{backendError.message}</h1>}
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