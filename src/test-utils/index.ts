import {createAPI} from '../services/api';
import thunk from 'redux-thunk';
import {configureMockStore} from '@jedmao/redux-mock-store';
import {State} from '../types/state';
import {Action, ThunkDispatch} from '@reduxjs/toolkit';

const api = createAPI();
const middlewares = [thunk.withExtraArgument(api)];
export const mockStore = configureMockStore<
	State,
	Action,
	ThunkDispatch<State, typeof api, Action>
	>(middlewares);
