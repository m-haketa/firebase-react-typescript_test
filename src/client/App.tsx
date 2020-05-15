import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { useFireBase } from './useFirebaseInit';

import { Index } from './pages/Index';
import { Restaurant } from './pages/Restaurant';

export const App: React.FC = () => {
  const user = useFireBase();

  return (
    <>
      <div>App: {user && user.user && user.user.uid}</div>
      <Router>
        <Switch>
          <Route exact path="/">
            <Index user={user}></Index>
          </Route>
          <Route exact path="/restaurant/:restaurant_id">
            <Restaurant user={user}></Restaurant>
          </Route>
        </Switch>
      </Router>
    </>
  );
};
