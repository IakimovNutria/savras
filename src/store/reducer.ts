import { combineReducers } from '@reduxjs/toolkit';
import { ReducerName } from '../enums/reducer-name';
import { authorizationReducer } from './authorization-reducer';
import { pipelineReducer } from './pipeline-reducer';
import { mainReducer } from './main-reducer';

export const reducer = combineReducers({
	[ReducerName.PIPELINE]: pipelineReducer.reducer,
	[ReducerName.MAIN]: mainReducer.reducer,
	[ReducerName.AUTHORIZATION]: authorizationReducer.reducer,
});
