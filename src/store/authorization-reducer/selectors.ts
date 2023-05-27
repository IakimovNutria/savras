import { State } from '../../types/state';
import { ReducerName } from '../../enums/reducer-name';
import AuthorizationStatus from '../../enums/authorization-status';

export const getAuthorizationStatus = (state: State): AuthorizationStatus => state[ReducerName.AUTHORIZATION].authorization;
