import React, { useEffect, useState } from 'react';
import * as firebase from 'firebase';

const rootCollection = 'restaurants';

export const firebaseConfig = {
  projectId: 'tutorial-277014',
  databaseURL: 'https://tutorial-277014.firebaseio.com',
  storageBucket: 'tutorial-277014.appspot.com',
  locationId: 'asia-northeast1',
  apiKey: 'AIzaSyDgUtOthKXWACyhm8BXM65NI40NqUgdeoc',
  authDomain: 'tutorial-277014.firebaseapp.com',
  messagingSenderId: '1058197441056',
};

export const createRenderData = <T extends any>(
  doc: firebase.firestore.DocumentChange<T>['doc']
): T => {
  const data = doc.data();
  return data;
};

export const App: React.FC = () => {
  const [user, setUser] = useState<firebase.auth.UserCredential>();

  useEffect(() => {
    console.log('setuser async');
    firebase.initializeApp(firebaseConfig);

    firebase
      .auth()
      .signInAnonymously()
      .then((u) => {
        setUser(u);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const [data, setData] = useState([] as any);

  useEffect(() => {
    const query = firebase
      .firestore()
      .collection(rootCollection)
      .orderBy('avgRating', 'desc')
      .limit(50);

    query.onSnapshot((snapshot) => {
      if (!snapshot.size) return null;

      snapshot.docChanges().forEach((change) => {
        if (change.type === 'removed') {
          setData((pd: any) => pd.filter((d: any) => d.id !== change.doc.id));
        } else {
          const d = createRenderData(change.doc);
          setData((pd: any) => {
            const newD = pd.filter((d: any) => d.id !== change.doc.id);
            return [...newD, { ...d, id: change.doc.id }];
          });
        }
      });
    });
  }, [user]);

  return (
    <>
      <div>App: {user && user.user && user.user.uid}</div>
      <div>
        Data:
        {data &&
          data.map((d: any) => (
            <div key={d.id}>
              {d.id}、{d.name}、{d.numRatings}、{d.avgRating}
            </div>
          ))}
      </div>
    </>
  );
};
