import { createSlice } from '@reduxjs/toolkit';
import { ReducerName } from '../../enums/reducer-name';
import AuthorizationStatus from '../../enums/authorization-status';
import AuthorizationReducerState from '../../types/authorization-reducer-state';
import {
	setAuthorization,
	checkAuthAction,
	signInAction,
	signUpAction
} from './actions';

const initialState: AuthorizationReducerState = {
	authorization: AuthorizationStatus.IN_PROCESS,
};

export const authorizationReducer = createSlice({
	name: ReducerName.AUTHORIZATION,
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(signInAction.fulfilled, (state) => {
				state.authorization = AuthorizationStatus.AUTHORIZED;
			})
			.addCase(signInAction.pending, (state) => {
				state.authorization = AuthorizationStatus.IN_PROCESS;
			})
			.addCase(signInAction.rejected, (state, action) => {
				console.log(action);
				state.authorization = AuthorizationStatus.BAD_AUTHENTICATE;
			})
			.addCase(signUpAction.fulfilled, (state) => {
				state.authorization = AuthorizationStatus.AUTHORIZED;
			})
			.addCase(signUpAction.rejected, (state) => {
				state.authorization = AuthorizationStatus.BAD_REGISTER;
			})
			.addCase(signUpAction.pending, (state) => {
				state.authorization = AuthorizationStatus.IN_PROCESS;
			})
			.addCase(checkAuthAction.fulfilled, (state) => {
				state.authorization = AuthorizationStatus.AUTHORIZED;
			})
			.addCase(checkAuthAction.rejected, (state) => {
				state.authorization = AuthorizationStatus.NOT_AUTHORIZED;
			})
			.addCase(checkAuthAction.pending, (state) => {
				state.authorization = AuthorizationStatus.IN_PROCESS;
			})
			.addCase(setAuthorization, (state, action) => {
				state.authorization = action.payload;
			});
	},
});
