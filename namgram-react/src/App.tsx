import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {useDispatch} from 'react-redux'
import './App.css';
import SigninForm from './components/auth/SigninForm';
import SignupForm from './components/auth/SignupForm';
import Navbar from './components/navigation/Navbar';
import Posts from './components/posts/Posts';
import { authUser } from './redux/auth/actions';
import Profile from './components/profile/Profile';
import Home from './components/home/Home';
import CreatePost from './components/posts/CreatePost';
import Chat from './components/chat/Chat';
import EditProfile from './components/profile/EditProfile';
import SinglePost from './components/posts/SinglePost';
import Hot from './components/posts/Hot';



function App() {
  const dispatch = useDispatch()
  dispatch(authUser());
  return (
    <React.Fragment>
      <Router>
        <Navbar />
          <Switch>
            <Route exact path="/signin" component={SigninForm} />
            <Route exact path="/signup" component={SignupForm} />
            <Route path="/profile/:id" component={Profile} />
            <Route path="/editProfile" component={EditProfile} />
            <Route path="/posts/create" component={CreatePost} />
            <Route path="/posts" component={Posts} />
            <Route path="/hot" component={Hot} />
            <Route path="/post/:id" component={SinglePost} />
            <Route path="/chat" component={Chat} />
            <Route path="/" component={Home} />
          </Switch>
      </Router>
    </React.Fragment>
  );
}

export default App;
