import React, { useState } from 'react';
import * as firebase from 'firebase';

const rootCollection = 'restaurants';

export const App: React.FC = () => {
  /*
  const [data, setData] = useState({} as any);

  const app = firebase.app();

  const query = firebase
    .firestore()
    .collection(rootCollection)
    .orderBy('avgRating', 'desc')
    .limit(50);

  query.onSnapshot((snapshot) => {
    if (!snapshot.size) return null;

    snapshot.docChanges().forEach((change) => {
      if (change.type === 'removed') {
        console.log('removed');
      } else {
        setData(change.doc);
      }
    });
  });

  return <div>{data}</div>;
  */
  return <div>App</div>;
};
