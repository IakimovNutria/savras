import SignIn from '../../../../savras/src/pages/sign-in/sign-in';
import Graph from '../../../../savras/src/pages/graph/graph';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={(<SignIn />)}/>
        <Route path='graph' element={<Graph />}/>
      </Routes>
    </BrowserRouter>);
}

export default App;
