import React, {FormEvent, useState} from 'react';
import {Link, Navigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {signInAction} from "../../store/api-actions";
import AuthorizationStatus from "../../enums/authorization-status";
import {setAuthorization} from "../../store/actions";
import {getAuthorizationStatus} from "../../store/authorization-reducer/selectors";


function SignIn(): JSX.Element {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch(signInAction({login: login, password: password}));
  }

  const authorizationStatus = useAppSelector(getAuthorizationStatus);

  if (authorizationStatus === AuthorizationStatus.AUTHORIZED) {
    return (<Navigate to={"/"} />);
  }

  return (
      <div className="authorization">
        <section className="authorization__section">
          <h1>Sign in</h1>
          <form onSubmit={handleSubmit} className="authorization__form">
            <input placeholder="Login" required
                   className="authorization__login" value={login}
                   onChange={(e) => setLogin(e.target.value)}
            />
            <input type="password" placeholder="Password" required
                   className="authorization__password" value={password}
                   onChange={(e) => setPassword(e.target.value)}
            />
            <button className="authorization__button" type="submit">Continue</button>
          </form>
          {
            authorizationStatus === AuthorizationStatus.BAD_AUTHENTICATE &&
              (<span className="authorization__error">invalid username or password</span>)
          }
        </section>
        <section className="authorization__section">
          <h2>Don't have account yet?</h2>
          <Link to={`/sign-up`} className="authorization__link"
                onClick={() => dispatch(setAuthorization(AuthorizationStatus.NOT_AUTHORIZED))}>
            Sign up
          </Link>
        </section>
      </div>
  );
}

export default SignIn;
