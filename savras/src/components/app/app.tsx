import SignIn from '../../pages/sign-in/sign-in';
import SignUp from '../../pages/sign-up/sign-up';
import Graph from '../../pages/graph/graph';
import MainPage from '../../pages/main-page/main-page';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Test from '../../pages/test/test';
import Pipeline from '../../pages/pipeline/pipeline';
import File from '../../pages/file/file'
import PrivateRoute from "../private-route/private-route";
import getUser from "../../requests/get-user";


function App(): JSX.Element {
  let hasAccess = false;
  getUser().then(r => {
    console.log(r);
    if (r === null) {

    } else if (r.ok) {
      hasAccess = true;
    }
  });
  console.log(1);
  return (
    <BrowserRouter>
      <Routes>
        <Route path='sign-in' element={(<SignIn />)}/>
        <Route path='sign-up' element={(<SignUp />)}/>
        <Route path='graph' element={<Graph />}/>
        <Route path='/' element={<MainPage />}/>
        <Route path='test' element={(<Test />)}/>
        <Route path='pipeline/:id' element={<PrivateRoute hasAccess={true} navigateTo={<Pipeline />} />}/>
        <Route path='file/:id' element={<PrivateRoute hasAccess={true} navigateTo={<File />} />}/>
      </Routes>
    </BrowserRouter>);
}

export default App;
