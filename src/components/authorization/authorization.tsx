import React, {ChangeEvent, FormEvent, useCallback, useState} from 'react';
import AuthorizationStatus from '../../enums/authorization-status';
import {Link} from 'react-router-dom';
import {setAuthorization} from '../../store/authorization-reducer/actions';
import {useAppDispatch} from '../../hooks';
import './authorization.css';
import {Button} from '../button/button';

type AuthorizationFormProps = {
	onSubmit: (action: {login: string, password: string}) => void;
	mainTitle: string;
	error: string;
	linkTitle: string;
	linkTo: string;
	linkName: string;
}

export function Authorization({onSubmit, mainTitle, error, linkTitle, linkTo, linkName}: AuthorizationFormProps): JSX.Element {
	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');
	const dispatch = useAppDispatch();
	const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onSubmit({login, password});
	}, [login, password]);
	const loginOnChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		setLogin(event.target.value);
	}, [login]);
	const passwordOnChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		setPassword(event.target.value);
	}, [password]);
	const linkOnClick = useCallback(() =>
		dispatch(setAuthorization(AuthorizationStatus.NOT_AUTHORIZED)), [dispatch]);
	return (
		<div className="authorization">
			<section className="authorization__main-section">
				<h1 className="authorization__main-title">{mainTitle}</h1>
				<form onSubmit={handleSubmit}
					className="authorization__form">
					<input
						placeholder="Login"
						required
						className="authorization__login-input"
						value={login}
						onChange={loginOnChange}
					/>
					<input
						type="password"
						placeholder="Password"
						required
						className="authorization__password-input"
						value={password}
						onChange={passwordOnChange}
					/>
					<Button type="submit"
						hasShadow
						className="authorization__button"
					>
						Continue
					</Button>
				</form>
				<span className="authorization__error">{error}</span>
			</section>
			<section className="authorization__link-section">
				<h2 className="authorization__link-title">{linkTitle}</h2>
				<Link
					to={linkTo}
					className="authorization__link"
					onClick={linkOnClick}
				>
					{linkName}
				</Link>
			</section>
		</div>
	);
}
