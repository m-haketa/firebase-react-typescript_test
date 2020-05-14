import React, { useEffect, useState } from 'react';
import * as firebase from 'firebase';

import { useFireBase } from './useFirebaseInit';

const rootCollection = 'restaurants';

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

export interface RestaurantsRatingsRet {
  rating: number;
  text: string;
  timestamp: Date;
  userId: string;
  userName: string;
}

type Doc = firebase.firestore.DocumentChange['doc'];

export type Get<T> = T & { id: string };

interface GetData {
  <F, R>(doc: Doc, decode: (fsData: F) => Partial<R>): Get<R>;
  <F>(doc: Doc): Get<F>;
}

export const getData: GetData = <F, R = F>(
  doc: Doc,
  decode?: (fsData: F) => R
): Get<R> | Get<F> => {
  const data = doc.data() as F;

  if (decode) {
    return { id: doc.id, ...data, ...decode(data) };
  } else {
    return { id: doc.id, ...data };
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getRestaurantsData = (doc: Doc) => getData<Restaurants>(doc);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getRestaurantsRatingsData = (doc: Doc) =>
  getData<RestaurantsRatings, RestaurantsRatingsRet>(doc, ({ timestamp }) => ({
    timestamp: new Date(timestamp),
  }));

export const App: React.FC = () => {
  const user = useFireBase();

  const [data, setData] = useState<Get<Restaurants>[]>([]);

  useEffect(() => {
    if (user === undefined) return;

    const query = firebase
      .firestore()
      .collection(rootCollection)
      .orderBy('avgRating', 'desc')
      .limit(50);

    query.onSnapshot((snapshot) => {
      if (!snapshot.size) return null;

      snapshot.docChanges().forEach((change) => {
        if (change.type === 'removed') {
          setData((pDocs) => pDocs.filter((pDoc) => pDoc.id !== change.doc.id));
        } else {
          const changeDoc = getRestaurantsData(change.doc);
          setData((pDocs) => {
            const newD = pDocs.filter((pDoc) => pDoc.id !== changeDoc.id);
            return [...newD, changeDoc];
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
