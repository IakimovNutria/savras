import SignIn from '../../pages/sign-in/sign-in';
import Graph from '../../pages/graph/graph';
import MainPage from '../../pages/main-page/main-page';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Test from '../../pages/test/test';
import Pipeline from '../../pages/pipeline/pipeline';
import File from '../../pages/file/file'


function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={(<SignIn />)}/>
        <Route path='graph' element={<Graph />}/>
        <Route path='main' element={(<MainPage />)}/>
        <Route path='test' element={(<Test />)}/>
        <Route path='pipeline/:id' element={<Pipeline />}/>
        <Route path='file/:id' element={<File />}/>
      </Routes>
    </BrowserRouter>);
}

export default App;
