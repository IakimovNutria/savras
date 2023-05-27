import { Navigate } from 'react-router-dom';
import React from 'react';

type PrivateRouteProps = {
    hasAccess: boolean;
    navigateTo: JSX.Element;
};

function PrivateRoute(props: PrivateRouteProps): JSX.Element {
	return props.hasAccess ? props.navigateTo : <Navigate to="/sign-in" />;
}

export default PrivateRoute;
