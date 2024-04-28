import {useState} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import {fastapiclient} from '../../client'
import InputForm from '../../components/InputForm'


const SignUp = () => {
  const [error, setError] = useState({ email: '', password: '', username: '', confirmPassword: '' });
  const [backendError, setBackendError] = useState('');
  let [isDisabled, setDisabledState] = useState(false);
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', username: '', confirmPassword: '' });
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
          } else if (registerForm.confirmPassword && value !== registerForm.confirmPassword) {
            stateObj["confirmPassword"] = "Password and Confirm Password does not match.";}
            else if (value.length < 8) {
            stateObj["password"] = "Password is too short";
            setDisabledState(true);
          } else {
            stateObj["confirmPassword"] = registerForm.confirmPassword ? "" : error.confirmPassword;
            setDisabledState(false);
          }
          break;

        case "confirmPassword":
          if (!value) {
            stateObj[name] = "Please enter Confirm Password.";
            setDisabledState(true);
          } else if (registerForm.password && value !== registerForm.password) {
            stateObj[name] = "Password and Confirm Password does not match.";
            setDisabledState(true);
          }
          else {
            setDisabledState(false);
          }
          break;

        default:
          break;
      }

      return stateObj;
    });
  }

  const onRegister = (e) => {
    e.preventDefault();
    setLoading(true)

    fastapiclient.register(registerForm.email, registerForm.password, registerForm.username)
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
            type={"email"}
            name={"email"}
            label={"Email"}
            required
            error={error.email}
            value={registerForm.email}
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
          <InputForm
            type={"password"}
            name={"confirmPassword"}
            label={"confirm Password"}
            required
            error={error.confirmPassword}
            value={registerForm.confirmPassword}
            onChange={onInputChange}
          />

        <button title={"Create Account"} error={error} loading={loading} disabled={isDisabled}>Create Account</button>
        <div>
        {(backendError !== '') &&
        <h1>{backendError.message}</h1>}
        </div>

  </form>)}


const Register = () => {
  return (
    <div className="App">
        <h1>Register</h1>

      <a><SignUp /></a>

    </div>
  );
};

export default Register;