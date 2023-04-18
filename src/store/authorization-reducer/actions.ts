import {createAction, createAsyncThunk} from '@reduxjs/toolkit';
import AuthorizationStatus from '../../enums/authorization-status';
import {AppDispatch, State} from '../../types/state';
import {AxiosInstance} from 'axios';
import {ApiRoute} from '../../enums/api-route';
import AuthorizationInfo from '../../types/authorization-info';

const Action = {
	SET_AUTHORIZATION: 'SET_AUTHORIZATION'
};


export const setAuthorization = createAction(
	Action.SET_AUTHORIZATION,
	(authorizationStatus: AuthorizationStatus) => ({ payload: authorizationStatus }),
);

export const checkAuthAction = createAsyncThunk<void, undefined, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.USER,
	async (_arg, { extra: api }) => {
		await api.get(ApiRoute.USER);
	},
);

export const signInAction = createAsyncThunk<void, AuthorizationInfo, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.USER_AUTHENTICATION,
	async ({ login, password }, { extra: api }) => {
		await api.post(ApiRoute.USER_AUTHENTICATION, `username=${login}&password=${password}`);
	},
);

export const signUpAction = createAsyncThunk<void, AuthorizationInfo, {
	dispatch: AppDispatch,
	state: State,
	extra: AxiosInstance
}>(
	ApiRoute.USER_REGISTRATION,
	async ({ login, password }, { extra: api }) => {
		await api.post(ApiRoute.USER_REGISTRATION, { username: login, password });
	},
);
