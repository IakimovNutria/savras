import React, {FormEvent, useState} from 'react';
import {Link} from "react-router-dom";


type SignInProps = {

}


async function setUser() {
  try {
    const response = await fetch('http://178.250.246.144:8000/api/v1/user/registration/', {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'JohSmith',
        password: 'manager',
      }),
      mode: 'cors'
    });
    return await response;
  } catch (error) {
    if (error instanceof Error) {
      console.log('error message: ', error.message);
      return error.message;
    } else {
      console.log('unexpected error: ', error);
      return 'An unexpected error occurred';
    }
  }
}


async function getUsers() {
  try {
    const response = await fetch('http://178.250.246.144:8000/api/v1/user/authentication/', {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': 'Accept',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: "username=JohnSmith&password=manager",
      mode: 'cors'
    });
    return await response
  } catch (error) {
    if (error instanceof Error) {
      console.log('error message: ', error.message);
      return error.message;
    } else {
      console.log('unexpected error: ', error);
      return 'An unexpected error occurred';
    }
  }
}



function SignIn(): JSX.Element {
  setUser().then(obj => console.log(obj));
  getUsers().then(obj => console.log(obj));
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };
  return (
        <div className="sign-in">
          <h1>Sign in</h1>
          <form className="sign-in__form" onSubmit={handleSubmit}>
            <div className="sign-in__fields">
              <div className="sign-in__field">
                <input className="sign-in__input" type="login" placeholder="Login" name="user-login"
                  id="user-login" value={login} onChange={(e) => setLogin(e.target.value)}
                />
                <label className="sign-in__label" form="user-login">Login</label>
              </div>
              <div className="sign-in__field">
                <input className="sign-in__input" type="password" placeholder="Password" name="user-password"
                  id="user-password" value={password} onChange={(e) => setPassword(e.target.value)}
                />
                <label className="sign-in__label" form="user-password">Password</label>
              </div>
            </div>
            <div className="sign-in-buttons">
              <Link to={`/`}><button className="sign-in__btn" type="submit">Sign in</button></Link>
              <Link to={`/sign-up`}><button className="sign-up__btn" type="button">Sign up</button></Link>
            </div>
          </form>
        </div>
  );
}

export default SignIn;
