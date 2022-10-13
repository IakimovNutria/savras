import React, {FormEvent, useState} from 'react';


const SignInStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column' as const
};

const SignInSubmitStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

function SignIn(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };
  return (
    <html>
      <head>
        <title>Savras</title>
        <meta name="robots" content="noindex, nofollow"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </head>
      <body>
        <div className="sign-in" style={SignInStyle}>
          <h1>Sign in</h1>
          <form className="sign-in__form" onSubmit={handleSubmit}>
            <div className="sign-in__fields">
              <div className="sign-in__field">
                <input className="sign-in__input" type="email" placeholder="Email address" name="user-email"
                  id="user-email" value={email} onChange={(e) => setEmail(e.target.value)}
                />
                <label className="sign-in__label" form="user-email">Email address</label>
              </div>
              <div className="sign-in__field">
                <input className="sign-in__input" type="password" placeholder="Password" name="user-password"
                  id="user-password" value={password} onChange={(e) => setPassword(e.target.value)}
                />
                <label className="sign-in__label" form="user-password">Password</label>
              </div>
            </div>
            <div className="sign-in__submit" style={SignInSubmitStyle}>
              <button className="sign-in__btn" type="submit">Sign in</button>
            </div>
          </form>
        </div>
      </body>
    </html>
  );
}

export default SignIn;
