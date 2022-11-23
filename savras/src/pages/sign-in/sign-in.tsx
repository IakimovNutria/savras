import React, {FormEvent, useState} from 'react';


function SignIn(): JSX.Element {
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
              <button className="sign-in__btn" type="submit">Sign in</button>
              <button className="sign-up__btn" type="button">Sign up</button>
            </div>
          </form>
        </div>
  );
}

export default SignIn;
