import SignIn from '../../pages/sign-in/sign-in';
import SignUp from '../../pages/sign-up/sign-up';
import Graph from '../../pages/graph/graph';
import MainPage from '../../pages/main-page/main-page';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Test from '../../pages/test/test';
import Pipeline from '../../pages/pipeline/pipeline';
import File from '../../pages/file/file'
import PrivateRoute from "../private-route/private-route";
import React from "react";
import {useAppSelector, useAppDispatch} from "../../hooks";
import AuthorizationStatus from "../../types/authorizationStatus";
import {checkAuthAction} from "../../store/api-actions";


function App(): JSX.Element {
  const authorizationStatus = useAppSelector((state) => state.authorization);
  if (authorizationStatus === AuthorizationStatus.IN_PROCESS) {
    return (<h1>Loading</h1>);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='sign-in' element={(<SignIn />)}/>
        <Route path='sign-up' element={(<SignUp />)}/>
        <Route path='graph' element={<Graph />}/>
        <Route path='/' element={<PrivateRoute hasAccess={authorizationStatus === AuthorizationStatus.AUTHORIZED}
                                               navigateTo={<MainPage />}/>}/>
        <Route path='test' element={(<Test />)}/>
        <Route path='pipeline/:id' element={<PrivateRoute hasAccess={true} navigateTo={<Pipeline />} />}/>
        <Route path='file/:id' element={<PrivateRoute hasAccess={true} navigateTo={<File />} />}/>
      </Routes>
    </BrowserRouter>);
}

export default App;
