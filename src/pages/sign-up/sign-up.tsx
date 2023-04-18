import React, { useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { signUpAction } from '../../store/authorization-reducer/actions';
import { useAppDispatch, useAppSelector } from '../../hooks';
import AuthorizationStatus from '../../enums/authorization-status';
import { getAuthorizationStatus } from '../../store/authorization-reducer/selectors';
import { Authorization } from '../../components/authorization/authorization';

function SignUp(): JSX.Element {
	const dispatch = useAppDispatch();

	const handleSubmit = useCallback(({login, password}: {login: string, password: string}) =>
		dispatch(signUpAction({login, password})), [dispatch]);

	const authorizationStatus = useAppSelector(getAuthorizationStatus);

	if (authorizationStatus === AuthorizationStatus.AUTHORIZED) {
		return (<Navigate to="/" />);
	}

	return (
		<Authorization onSubmit={handleSubmit}
			mainTitle='Sign up'
			error={authorizationStatus === AuthorizationStatus.BAD_REGISTER ? 'account already exist' : ''}
			linkTitle={'Already have an account?'}
			linkTo={'/sign-in'}
			linkName={'Sign in'} />
	);
}

export default SignUp;
