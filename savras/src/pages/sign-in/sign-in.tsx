import React, {FormEvent, useState} from 'react';
import {Link, Navigate} from "react-router-dom";
import authenticateUser from "../../requests/authenticate";

type SignInProps = {

}


const AuthenticateStates = {
  AUTHENTICATED: 'authenticated',
  DEFAULT: 'not-authenticated',
  BAD_AUTHENTICATE: 'bad-authenticate'
};


function SignIn(): JSX.Element {
  const [authenticate, setAuthenticate] = useState(AuthenticateStates.DEFAULT);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    authenticateUser(login, password).then((response) => {
      if (response === null) {
        console.log("error on register");
      } else if (response.ok) {
        setAuthenticate(AuthenticateStates.AUTHENTICATED);
      } else {
        setAuthenticate(AuthenticateStates.BAD_AUTHENTICATE);
      }
    });
  }
  if (authenticate === AuthenticateStates.DEFAULT)
    return (
          <div className="auth-form">
            <div className="centered-elements block">
              <h1>Sign in</h1>
              <form onSubmit={handleSubmit}>
                <div>
                  <div style={{marginBottom: 5}}>
                    <input type="login" placeholder="Login" name="user-login" required className="text-input"
                      id="user-login" value={login} onChange={(e) => setLogin(e.target.value)}
                    />
                  </div>
                  <div>
                    <input type="password" placeholder="Password" name="user-password" required className="text-input"
                      id="user-password" value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div className="centered-elements">
                  <button className="block-button" type="submit">Sign in</button>
                </div>
              </form>
            </div>
            <div className="block centered-elements">
              <h3 style={{margin: 0, marginTop: 15}}>Don't have account yet?</h3>
              <Link to={`/sign-up`}><button className="block-button" type="button">Sign up</button></Link>
            </div>
          </div>
    );
  else {
    return <Navigate to='/'/>;
  }
}

export default SignIn;
