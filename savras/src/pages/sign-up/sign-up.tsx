import React, {FormEvent, useState} from 'react';
import {Link, Navigate} from "react-router-dom";
import registerUser from "../../requests/register";


const RegisterStates = {
    REGISTERED: 'registered',
    DEFAULT: 'not-registered',
    BAD_REGISTER: 'bad-register'
};


function SignUp(): JSX.Element {
    const [register, setRegister] = useState(RegisterStates.DEFAULT);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        registerUser(login, password).then((response) => {
            if (response === null) {
                console.log("error on register");
            } else if (response.ok) {
                setRegister(RegisterStates.REGISTERED);
            } else {

            }
        });
    }
    if (register === RegisterStates.DEFAULT)
    {
        return (
            <div className="auth-form">
                <div className="centered-elements block">
                    <h1>Sign up</h1>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <div style={{marginBottom: 5}}>
                                <input type="text" placeholder="Login" name="user-login" required className="text-input"
                                       id="user-login" value={login}
                                       onChange={(e) => setLogin(e.target.value)}
                                />
                            </div>
                            <div>
                                <input type="password" placeholder="Password" name="user-password" required className="text-input"
                                       id="user-password" value={password}
                                       onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="centered-elements">
                            <button className="block-button" type="submit"><span>Sign up</span></button>
                        </div>
                    </form>
                </div>
                <div className="centered-elements block">
                    <h3 style={{margin: 0, marginTop: 15}}>Already have an account?</h3>
                    <Link to={`/sign-in`}><button className="block-button" type="button"><span>Sign in</span></button></Link>
                </div>
            </div>
    );}
    else {
        return <Navigate to='/'/>;
    }
}

export default SignUp;
