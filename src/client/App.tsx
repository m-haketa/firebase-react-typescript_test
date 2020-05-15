import React from 'react';

import { useFireBase } from './useFirebaseInit';

import { Index } from './pages/Index';

export const App: React.FC = () => {
  const user = useFireBase();

  return (
    <>
      <div>App: {user && user.user && user.user.uid}</div>
      <Index user={user}></Index>
    </>
  );
};
