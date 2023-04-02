import { combineReducers } from '@reduxjs/toolkit';
import { ReducerName } from '../enums/reducer-name';
import { authorizationReducer } from './authorization-reducer/authorization-reducer';
import { pipelineReducer } from './pipeline-reducer/pipeline-reducer';
import { mainReducer } from './main-reducer/main-reducer';

export const reducer = combineReducers({
	[ReducerName.Pipeline]: pipelineReducer.reducer,
	[ReducerName.Main]: mainReducer.reducer,
	[ReducerName.Authorization]: authorizationReducer.reducer,
});
