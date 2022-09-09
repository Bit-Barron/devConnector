import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-forms/CreateProfile';
import PrivateRoute from './components/routing/PrivateRoute';
 
//redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import { useEffect } from 'react';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <>
          <Navbar />
          <section className='container'>
            <Alert />
            <Routes>
              <Route path='/' element={<Landing />} />
              <Route path='/register' element={<Register />} />
              <Route path='/login' element={<Login />} />

              <Route
                path='/dashboard'
                //@ts-ignore
                element={<PrivateRoute component={Dashboard} />}
              />
              <Route
                path='/create-profile'
                //@ts-ignore
                element={<PrivateRoute component={CreateProfile } />}
              />
            </Routes>
          </section>
        </>
      </Router>
    </Provider>
  );
};

export default App;
