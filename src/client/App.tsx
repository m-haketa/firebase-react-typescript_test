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

export interface Restaurants {
  avgRating: number;
  category: string;
  city: string;
  name: string;
  numRatings: number;
  photo: string;
  price: number;
}

export interface RestaurantsRatings {
  rating: number;
  text: string;
  timestamp: string;
  userId: string;
  userName: string;
}

export type Get<T> = T & { id: string };

type Doc = firebase.firestore.DocumentChange['doc'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getData = <T extends { id: string }>(doc: Doc): T => {
  const data = doc.data();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data as any;
};

const getRestaurantsData = (doc: Doc): Get<Restaurants> =>
  getData<Get<Restaurants>>(doc);

const getRestaurantsRatingsData = (doc: Doc): Get<RestaurantsRatings> =>
  getData<Get<RestaurantsRatings>>(doc);

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

  const [data, setData] = useState<Get<Restaurants>[]>([]);

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
          setData((pd) => pd.filter((d) => d.id !== change.doc.id));
        } else {
          const d = getRestaurantsData(change.doc);
          setData((pd) => {
            const newD = pd.filter((d) => d.id !== change.doc.id);
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
          data.map((d) => (
            <div key={d.id}>
              {d.id}、{d.name}、{d.numRatings}、{d.avgRating}
            </div>
          ))}
      </div>
    </>
  );
};
