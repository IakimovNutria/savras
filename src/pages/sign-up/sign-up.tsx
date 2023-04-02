import React, { FormEvent, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { signUpAction } from '../../store/api-actions';
import { useAppDispatch, useAppSelector } from '../../hooks';
import AuthorizationStatus from '../../enums/authorization-status';
import { setAuthorization } from '../../store/actions';
import { getAuthorizationStatus } from '../../store/authorization-reducer/selectors';

function SignUp(): JSX.Element {
	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');
	const dispatch = useAppDispatch();

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		dispatch(signUpAction({ login, password }));
	}

	const authorizationStatus = useAppSelector(getAuthorizationStatus);

	if (authorizationStatus === AuthorizationStatus.AUTHORIZED) {
		return (<Navigate to="/" />);
	}

	return (
		<div className="authorization">
			<section className="authorization__section">
				<h1>Sign up</h1>
				<form onSubmit={handleSubmit}
					className="authorization__form">
					<input
						placeholder="Login"
						required
						className="authorization__login-input"
						value={login}
						onChange={(e) => setLogin(e.target.value)}
					/>
					<input
						type="password"
						placeholder="Password"
						required
						className="authorization__password-input"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<button className="authorization__button"
						type="submit">Continue</button>
				</form>
				{
					authorizationStatus === AuthorizationStatus.BAD_REGISTER
                        && (<span className="authorization__error">account already exist</span>)
				}
			</section>
			<section className="authorization__section">
				<h2>Already have an account?</h2>
				<Link
					to="/sign-in"
					className="authorization__link"
					onClick={() => dispatch(setAuthorization(AuthorizationStatus.NOT_AUTHORIZED))}
				>
  Sign in
				</Link>
			</section>
		</div>
	);
}

export default SignUp;
