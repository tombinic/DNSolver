import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute.jsx'
import Login from './components/Login.jsx'
import SignIn from './components/SignIn.jsx'
import Dashboard from './components/Dashboard.jsx'
import './style.css';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route exact path="/login" element={ <Login/> }></Route>
            <Route exact path="/dashboard" element={ <PrivateRoute> <Dashboard/> </PrivateRoute> }/>
            <Route exact path="/" element={ <Login/> }/>
            <Route exact path="/signin" element={ <SignIn/> }></Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
