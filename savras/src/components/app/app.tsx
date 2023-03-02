import SignIn from '../../pages/sign-in/sign-in';
import SignUp from '../../pages/sign-up/sign-up';
import MainPage from '../../pages/main-page/main-page';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Pipeline from '../../pages/pipeline/pipeline';
import PrivateRoute from "../private-route/private-route";
import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks";
import AuthorizationStatus from "../../enums/authorization-status";
import {fetchFilesAction, fetchSharedPipelinesAction, fetchUserPipelinesAction} from "../../store/api-actions";
import {getAuthorizationStatus} from "../../store/authorization-reducer/selectors";

function App(): JSX.Element {
  const authorizationStatus = useAppSelector(getAuthorizationStatus);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (authorizationStatus === AuthorizationStatus.AUTHORIZED) {
      dispatch(fetchFilesAction());
      dispatch(fetchUserPipelinesAction());
      dispatch(fetchSharedPipelinesAction());
    }
  }, [authorizationStatus]);
  if (authorizationStatus === AuthorizationStatus.IN_PROCESS) {
    return (<h1>Loading</h1>);
  }


  return (
    <BrowserRouter>
      <Routes>
        <Route path='sign-in' element={(<SignIn />)}/>
        <Route path='sign-up' element={(<SignUp />)}/>
        <Route path='/' element={<PrivateRoute hasAccess={authorizationStatus === AuthorizationStatus.AUTHORIZED}
                                               navigateTo={<MainPage />}/>}/>
        <Route path='pipeline/:id' element={<PrivateRoute hasAccess={authorizationStatus === AuthorizationStatus.AUTHORIZED}
                                                          navigateTo={<Pipeline />} />}/>
      </Routes>
    </BrowserRouter>);
}

export default App;
