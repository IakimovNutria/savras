import React, {FormEvent, useCallback} from 'react';
import { useCookies } from 'react-cookie';
import { useAppDispatch } from '../../hooks';
import { setAuthorization } from '../../store/authorization-reducer/actions';
import AuthorizationStatus from '../../enums/authorization-status';
import './main.css';
import FilesSection from '../../components/files-section/files-section';
import PipelinesSection from '../../components/pipelines-section/pipelines-section';
import {HeaderButton} from '../../components/header-button/header-button';

function Main(): JSX.Element {
	const [, , removeCookie] = useCookies(['token']);
	const dispatch = useAppDispatch();

	const signOutHandler = useCallback((event: FormEvent<HTMLButtonElement>) => {
		event.preventDefault();
		removeCookie('token');
		dispatch(setAuthorization(AuthorizationStatus.NOT_AUTHORIZED));
	}, [dispatch]);

	return (
		<React.Fragment>
			<header className="main__header">
				<HeaderButton onClick={signOutHandler}>SIGN OUT</HeaderButton>
			</header>
			<div className="main__body">
				<h1 style={{ display: 'none' }}>main page</h1>
				<FilesSection />
				<div className="main__divide-line" />
				<PipelinesSection />
			</div>
		</React.Fragment>
	);
}

export default Main;
