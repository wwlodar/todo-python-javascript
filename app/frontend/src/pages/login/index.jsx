import {useState} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import {fastapiclient} from '../../client'
import InputForm from '../../components/InputForm'


const LoginUser = () => {
  const [error, setError] = useState({ email: '', password: '', username: '', confirmPassword: '' });
  const [backendError, setBackendError] = useState('');
  let [isDisabled, setDisabledState] = useState(false);
  const [LoginForm, setLoginForm] = useState({ email: '', password: '', username: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()


  const onInputChange = e => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({
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

    fastapiclient.login(loginForm.password, loginForm.username)
      .then( () => {
        navigate('/')
      })
      .catch( (err) => {
        setLoading(false)
        setBackendError(err);
      });
  }
  return (
  <form onSubmit={(e) => onRegister(e)}>
         <InputForm
            type={"text"}
            name={"username"}
            label={"Username"}
            required
            error={error.username}
            value={registerForm.username}
            onChange={onInputChange}
          />
          <InputForm
            type={"password"}
            name={"password"}
            label={"Password"}
            required
            error={error.password}
            value={registerForm.password}
            onChange={onInputChange}
          />

        <button title={"Login"} error={error} loading={loading} disabled={isDisabled}>Login</button>
        <div>
        {(backendError !== '') &&
        <h1>{backendError.message}</h1>}
        </div>

  </form>)}


const Login = () => {
  return (
    <div className="App">
        <h1>Login</h1>

      <a><LoginUser /></a>

    </div>
  );
};

export default Login;