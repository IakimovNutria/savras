import SignIn from '../../pages/sign-in/sign-in';
import SignUp from '../../pages/sign-up/sign-up';
import Graph from '../graph/graph';
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
        <Route path='graph' element={<Graph timeSeries={[{datetime: "2023-01-12T11:14:17.922Z", value: 2},
          {datetime: "2023-01-13T11:14:17.922Z", value: 8},
          {datetime: "2023-01-14T11:14:17.922Z", value: 5},
          {datetime: "2023-01-15T11:14:17.922Z", value: 1}]} name={"123"} width={500} height={320}/>}/>
        <Route path='/' element={<PrivateRoute hasAccess={authorizationStatus === AuthorizationStatus.AUTHORIZED}
                                               navigateTo={<MainPage />}/>}/>
        <Route path='test' element={(<Test />)}/>
        <Route path='pipeline/:id' element={<PrivateRoute hasAccess={authorizationStatus === AuthorizationStatus.AUTHORIZED}
                                                          navigateTo={<Pipeline />} />}/>
        <Route path='file/:id' element={<PrivateRoute hasAccess={authorizationStatus === AuthorizationStatus.AUTHORIZED}
                                                      navigateTo={<File />} />}/>
      </Routes>
    </BrowserRouter>);
}

export default App;
