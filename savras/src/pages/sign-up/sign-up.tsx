import React, {FormEvent, useState} from 'react';


function SignUp(): JSX.Element {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };
    return (
        <div className="sign-up">
            <h1>Sign up</h1>
            <form className="sign-up__form" onSubmit={handleSubmit}>
                <div className="sign-up__fields">
                    <div className="sign-up__field">
                        <input className="sign-up__input" type="text" placeholder="Login" name="user-login"
                               id="user-login" value={login}
                               onChange={(e) => setLogin(e.target.value)}
                        />
                        <label className="sign-up__label" form="user-login">Login</label>
                    </div>
                    <div className="sign-up__field">
                        <input className="sign-up__input" type="password" placeholder="Password" name="user-password"
                               id="user-password" value={password}
                               onChange={(e) => setPassword(e.target.value)}
                        />
                        <label className="sign-up__label" form="user-password">Password</label>
                    </div>
                </div>
                <div className="sign-up-buttons">
                    <button className="sign-up__btn" type="submit">Sign up</button>
                </div>
            </form>
        </div>
    );
}

export default SignUp;
