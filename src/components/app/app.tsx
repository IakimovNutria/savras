import { Routes, Route } from 'react-router-dom';
import React, { useEffect } from 'react';
import SignIn from '../../pages/sign-in/sign-in';
import SignUp from '../../pages/sign-up/sign-up';
import Main from '../../pages/main/main';
import Pipeline from '../../pages/pipeline/pipeline';
import PrivateRoute from '../private-route/private-route';
import { useAppDispatch, useAppSelector } from '../../hooks';
import AuthorizationStatus from '../../enums/authorization-status';
import {
	fetchFilesAction,
	fetchSharedPipelinesAction,
	fetchUserPipelinesAction
} from '../../store/main-reducer/actions';
import {
	checkAuthAction
} from '../../store/authorization-reducer/actions';
import { getAuthorizationStatus } from '../../store/authorization-reducer/selectors';
import Loading from '../loading/loading';
import NotFound from '../../pages/not-found/not-found';

function App(): JSX.Element {
	const authorizationStatus = useAppSelector(getAuthorizationStatus);
	const dispatch = useAppDispatch();
	useEffect(() => {
		dispatch(checkAuthAction());
	}, []);
	useEffect(() => {
		if (authorizationStatus === AuthorizationStatus.AUTHORIZED) {
			dispatch(fetchFilesAction());
			dispatch(fetchUserPipelinesAction());
			dispatch(fetchSharedPipelinesAction());
		}
	}, [authorizationStatus]);
	if (authorizationStatus === AuthorizationStatus.IN_PROCESS) {
		return <Loading />;
	}

	return (
		<Routes>
			<Route path="sign-in"
				element={<SignIn />}
			/>
			<Route path="sign-up"
				element={<SignUp />}
			/>
			<Route
				path="/"
				element={(
					<PrivateRoute
						hasAccess={authorizationStatus === AuthorizationStatus.AUTHORIZED}
						navigateTo={<Main />}
					/>
				)}
			/>
			<Route
				path="pipeline/:id"
				element={(
					<PrivateRoute
						hasAccess={authorizationStatus === AuthorizationStatus.AUTHORIZED}
						navigateTo={<Pipeline />}
					/>
				)}
			/>
			<Route path='*'
				element={<NotFound />}
			/>
		</Routes>
	);
}

export default App;
