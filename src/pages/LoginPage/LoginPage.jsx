import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Buttons/Buttons";
// import logo from "../../assets/logos/vertical_fulllogo.svg";
import logoicon from "../../assets/icons/icononly_transparent_nobuffer.png";
import logotext from "../../assets/icons/textonly_nobuffer.png"
import "./LoginPage.scss";
import axios from "axios";
import { Triangle } from "react-loader-spinner";

export function LoginPage({setLoggedIn}) {
  // console.log(setLoggedIn)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({ email: "", password: "" });
  const [invalidPW, setInvalidPW] = useState()
  const [invalidEmail, setInvalidEmail]= useState()
  const [spinner, setSpinner]= useState(false)


  const API_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  function handleCreateAccount(event) {
    event.preventDefault();
    navigate("/createaccount");
  }

  const isInputValid = () => {
    let errors = { email: "", password: "" };

    if (!email) {
      errors.email = "Email is required";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    setFormErrors(errors);
    // Return true if no errors, false otherwise
    return !(errors.email || errors.password);
  };


  function handleOnSubmit(event) {
    event.preventDefault();
    setSpinner(true);

    if (isInputValid()) {
    } else {
      
    }

    axios
    .post(`${API_URL}/login/user`,{
    email: email, 
    password: password
    })
    .then((response)=> {
      sessionStorage.setItem('token', response.data.accessToken);
      sessionStorage.setItem('user_id', response.data.user_id);
      setLoggedIn(true)
      setSpinner(false)
      navigate(`/profile/${response.data.user_id}`)
    })
    .catch((err)=> {
      if(err.response && err.response.status ===401){
        setInvalidPW(err.response.data)
      }
      if(err.response && err.response.status ===404){
        setInvalidEmail(err.response.data)
      }
      console.error(err)
    });
    
  }
  return (
    <div className="body">
      <img className="logo--landing" src={logoicon} alt="Roll & Reflect Logo" />
      <img className="logotext" src={logotext} alt="Roll& Reflect text"/>

      <h2>Welcome Back </h2>
      {spinner === true? (
      <>
      <Triangle/> 
      <h3>Please Wait while we find your account</h3>
      </>
      ) 
    : null}
      <div className="form__wrapper">
        <form className="form__form" onSubmit={handleOnSubmit}>

          <label className="form__label">E-mail</label>
          <input
            type="text"
            className={
              formErrors.email
              ? "form__field form__field--error"
              : "form__field"
            }
            name="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            />
          {formErrors.email && (
            <div className="form__error-message">{formErrors.email}</div>
            )}
            {invalidEmail && (
                <div className="form__error-message">{invalidEmail}</div>
              )}
          <label className="form__label" id="password">
            Password
          </label>
          <input
            type="password"
            className={
              formErrors.password
              ? "form__field form__field--error"
              : "form__field"
            }
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
          />
          {formErrors.password && (
            <div className="form__error-message">{formErrors.password}</div>
          )}
          {invalidPW && (
            <div className="form__error-message">{invalidPW}</div>
          )}

          <div className="btn-containerLogin">

            <Button text="Login" />

            <Button
              text="Sign Up"
              type="button"
              clickHandler={handleCreateAccount}
            />
          </div>
        </form>
      </div>

      <p className="quote">
        Learning to grapple can be a real twisty journey, but remember, every
        submission brings you one step closer to becoming a master of your own
        fate!
      </p>
    </div>
  );
}

