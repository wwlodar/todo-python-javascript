import {useState} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import {fastapiclient} from '../../client'
import InputForm from '../../components/InputForm'


const SignUp = () => {
  const [error, setError] = useState({ email: '', password: '', username: '', confirmPassword: '' });
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', username: '', confirmPassword: '' });  // 1
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()  // 2


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
          if (!value) {
            stateObj[name] = "Please enter Username.";
          }
          break;

        case "password":
          if (!value) {
            stateObj[name] = "Please enter Password.";
          } else if (registerForm.confirmPassword && value !== registerForm.confirmPassword) {
            stateObj["confirmPassword"] = "Password and Confirm Password does not match.";}
            else if (value.length < 8) {
            stateObj["password"] = "Password is too short";
          } else {
            stateObj["confirmPassword"] = registerForm.confirmPassword ? "" : error.confirmPassword;
          }
          break;

        case "confirmPassword":
          if (!value) {
            stateObj[name] = "Please enter Confirm Password.";
          } else if (registerForm.password && value !== registerForm.password) {
            stateObj[name] = "Password and Confirm Password does not match.";
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
    setError(false);

    fastapiclient.register(registerForm.email, registerForm.password, registerForm.username)
      .then( () => {
        navigate('/')
      })
      .catch( (err) => {
        setLoading(false)
        setError(true);
        alert(err)
      });
  }
  return (
  <form onSubmit={(e) => onRegister(e)}>
         <InputForm
            type={"text"}
            name={"username"}
            label={"Username"}
            error={error.username}
            value={registerForm.username}
            onChange={(e) => setRegisterForm({...registerForm, username: e.target.value })}
          />
          <InputForm
            type={"email"}
            name={"email"}
            label={"Email"}
            error={error.email}
            value={registerForm.email}
            onChange={(e) => setRegisterForm({...registerForm, email: e.target.value })}
          />
          <InputForm
            type={"password"}
            name={"password"}
            label={"Password"}
            error={error.password}
            value={registerForm.password}
            onChange={onInputChange}
          />
                    <InputForm
            type={"confirmPassword"}
            name={"confirmPassword"}
            label={"confirm Password"}
            error={error.confirmPassword}
            value={registerForm.confirmPassword}
            onChange={onInputChange}
          />
        <button title={"Create Account"} error={error.password} loading={loading} class='rounded'>Create Account</button>

  </form>)}


const Register = () => {
  return (
    <div className="App">
        <h1 class="mb-4">Register here</h1>

      <a><SignUp /></a>
    </div>
  );
};

export default Register;