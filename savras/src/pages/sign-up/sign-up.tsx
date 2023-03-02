import React, {FormEvent, useState} from 'react';
import {Link, Navigate} from "react-router-dom";
import {signUpAction} from "../../store/api-actions";
import {useAppDispatch, useAppSelector} from "../../hooks";
import AuthorizationStatus from "../../enums/authorization-status";
import {setAuthorization} from "../../store/actions";
import {getAuthorizationStatus} from "../../store/authorization-reducer/selectors";


function SignUp(): JSX.Element {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        dispatch(signUpAction({login: login, password: password}));
    }

    const authorizationStatus = useAppSelector(getAuthorizationStatus);

    if (authorizationStatus === AuthorizationStatus.AUTHORIZED) {
        return (<Navigate to={"/"} />);
    }

    return (
        <div className="center">
            <div className="column-elements sign-in-block">
                <h1>Sign up</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <div style={{marginBottom: 5}}>
                            <input placeholder="Login" name="user-login" required className="text-input"
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
                    <div className="column-elements">
                        <button className="block-button" type="submit"><span>Continue</span></button>
                    </div>
                </form>
                {
                    authorizationStatus === AuthorizationStatus.BAD_REGISTER &&
                        (<div className="column-elements" style={{margin: 0, padding: 0, marginBottom: 15}}>
                            <h5 style={{padding: 0, margin: 0, color: "red"}}>account already exist</h5>
                        </div>)
                }
            </div>
            <div className="column-elements sign-in-block">
                <h3 style={{margin: 0, marginTop: 15}}>Already have an account?</h3>
                <Link to={`/sign-in`}>
                    <button className="block-button" type="button"
                            onClick={() => dispatch(setAuthorization(AuthorizationStatus.NOT_AUTHORIZED))}>
                        Sign in
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default SignUp;
