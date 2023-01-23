import React, {FormEvent, useState} from 'react';
import {Link, Navigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {signInAction} from "../../store/api-actions";
import AuthorizationStatus from "../../types/authorization-status";
import {setAuthorization} from "../../store/actions";


function SignIn(): JSX.Element {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch(signInAction({login: login, password: password}));
  }

  let authorizationStatus = useAppSelector((state) => state.authorization);

  if (authorizationStatus === AuthorizationStatus.AUTHORIZED) {
    return (<Navigate to={"/"} />);
  }

  return (
      <div className="center">
        <div className="column-elements sign-in-block">
          <h1>Sign in</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <div style={{marginBottom: 5}}>
                <input placeholder="Login" name="user-login" required className="text-input"
                  id="user-login" value={login} onChange={(e) => setLogin(e.target.value)}
                />
              </div>
              <div>
                <input type="password" placeholder="Password" name="user-password" required className="text-input"
                  id="user-password" value={password} onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="column-elements">
              <button className="block-button" type="submit">Continue</button>
            </div>
          </form>
          {
            authorizationStatus === AuthorizationStatus.BAD_AUTHENTICATE &&
              (<div className="column-elements" style={{margin: 0, padding: 0, marginBottom: 15}}>
                <h5 style={{padding: 0, margin: 0, color: "red"}}>invalid username or password</h5>
              </div>)
          }
        </div>
        <div className="sign-in-block column-elements">
          <h3 style={{margin: 0, marginTop: 15}}>Don't have account yet?</h3>
          <Link to={`/sign-up`}>
            <button className="block-button" type="button"
                    onClick={() => dispatch(setAuthorization(AuthorizationStatus.NOT_AUTHORIZED))}>
              Sign up
            </button>
          </Link>
        </div>
      </div>
  );
}

export default SignIn;
