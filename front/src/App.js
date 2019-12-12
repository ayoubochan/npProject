import React from 'react';
import './App.scss';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Home from './components/Home/index'
import Profile from './components/Profile/index'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' component={Home} exact />
        <Route path='/profile' component={Profile} />
      </Switch>
    </BrowserRouter>
    
  );
}

export default App;
