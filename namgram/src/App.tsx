import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import SigninForm from './components/auth/SigninForm';
import SignupForm from './components/auth/SignupForm';
import Navbar from './components/navigation/Navbar';
import Posts from './components/posts/Posts';

function App() {
  return (
    <React.Fragment>
      <Router>
        <Navbar />
          <Switch>
            <Route path="/signin">
              <SigninForm />
            </Route>
            <Route path="/signup">
              <SignupForm />
            </Route>
            <Route path="/">
              <Posts />
            </Route>
          </Switch>
      </Router>
    </React.Fragment>
  );
}

export default App;
