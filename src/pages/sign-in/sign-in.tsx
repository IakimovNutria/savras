import React, {useCallback} from 'react';
import { Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { signInAction } from '../../store/api-actions';
import AuthorizationStatus from '../../enums/authorization-status';
import { getAuthorizationStatus } from '../../store/authorization-reducer/selectors';
import {Authorization} from '../../components/authorization/authorization';

function SignIn(): JSX.Element {
	const authorizationStatus = useAppSelector(getAuthorizationStatus);
	const dispatch = useAppDispatch();
	const handleSubmit = useCallback(({login, password}: {login: string, password: string}) =>
		dispatch(signInAction({login, password})), [dispatch]);
	if (authorizationStatus === AuthorizationStatus.AUTHORIZED) {
		return (<Navigate to="/" />);
	}

	return (
		<Authorization onSubmit={handleSubmit}
			mainTitle='Sign in'
			error={authorizationStatus === AuthorizationStatus.BAD_AUTHENTICATE ? 'invalid username or password' : ''}
			linkTitle={'Don\'t have account yet?'}
			linkTo={'/sign-up'}
			linkName={'Sign up'} />
	);
}

export default SignIn;
