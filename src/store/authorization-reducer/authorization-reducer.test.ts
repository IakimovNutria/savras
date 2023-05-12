import AuthorizationReducerState from '../../types/authorization-reducer-state';
import AuthorizationStatus from '../../enums/authorization-status';
import {checkAuthAction, signInAction, signUpAction, setAuthorization} from './actions';
import {authorizationReducer} from './index';

describe('authorization-reducer', () => {
	let state: AuthorizationReducerState;

	beforeEach(() => {
		state = {
			authorization: AuthorizationStatus.IN_PROCESS
		};
	});

	it('without additional parameters should return initial state', () => {
		expect(authorizationReducer.reducer(void 0, { type: 'UNKNOWN_ACTION' }))
			.toEqual({
				authorization: AuthorizationStatus.IN_PROCESS
			});
	});

	describe('check-auth test', () => {
		it('should set authorizationStatus AUTHORIZED on fulfilled', () => {
			expect(authorizationReducer.reducer(state, {type: checkAuthAction.fulfilled.type}).authorization)
				.toEqual(AuthorizationStatus.AUTHORIZED);
		});
		it('should set authorizationStatus IN_PROCESS on pending', () => {
			expect(authorizationReducer.reducer(state, { type: checkAuthAction.pending.type}).authorization)
				.toEqual(AuthorizationStatus.IN_PROCESS);
		});
		it('should set not authorized on rejected', () => {
			expect(authorizationReducer.reducer(state, { type: checkAuthAction.rejected.type}).authorization)
				.toEqual(AuthorizationStatus.NOT_AUTHORIZED);
		});
	});

	describe('sign-in test', () => {
		it('should set authorizationStatus AUTHORIZED on fulfilled', () => {
			expect(authorizationReducer.reducer(state, { type: signInAction.fulfilled.type}).authorization)
				.toEqual(AuthorizationStatus.AUTHORIZED);
		});
		it('should set authorizationStatus IN_PROCESS on pending', () => {
			expect(authorizationReducer.reducer(state, { type: signInAction.pending.type}).authorization)
				.toEqual(AuthorizationStatus.IN_PROCESS);
		});
		it('should set authorizationStatus BAD_AUTHENTICATE on rejected', () => {
			expect(authorizationReducer.reducer(state, {type: signInAction.rejected.type}).authorization)
				.toEqual(AuthorizationStatus.BAD_AUTHENTICATE);
		});
	});

	describe('sign-up test', () => {
		it('should set authorizationStatus AUTHORIZED on fulfilled', () => {
			expect(authorizationReducer.reducer(state, { type: signUpAction.fulfilled.type}).authorization)
				.toEqual(AuthorizationStatus.AUTHORIZED);
		});
		it('should set authorizationStatus IN_PROCESS on pending', () => {
			expect(authorizationReducer.reducer(state, { type: signUpAction.pending.type}).authorization)
				.toEqual(AuthorizationStatus.IN_PROCESS);
		});
		it('should set authorizationStatus BAD_REGISTER on rejected', () => {
			expect(authorizationReducer.reducer(state, {type: signUpAction.rejected.type}).authorization)
				.toEqual(AuthorizationStatus.BAD_REGISTER);
		});
	});

	describe('set-authorization test', () => {
		it('should set authorizationStatus ', () => {
			expect(authorizationReducer.reducer(state, { type: setAuthorization.type, payload: AuthorizationStatus.IN_PROCESS}).authorization)
				.toEqual(AuthorizationStatus.IN_PROCESS);
			expect(authorizationReducer.reducer(state, { type: setAuthorization.type, payload: AuthorizationStatus.BAD_AUTHENTICATE}).authorization)
				.toEqual(AuthorizationStatus.BAD_AUTHENTICATE);
			expect(authorizationReducer.reducer(state, { type: setAuthorization.type, payload: AuthorizationStatus.BAD_REGISTER}).authorization)
				.toEqual(AuthorizationStatus.BAD_REGISTER);
		});
	});
});
