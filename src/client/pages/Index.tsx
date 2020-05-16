import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useFirebaseSnapshot } from '../useFirebaseSnapshot';
import type { UserCredential } from '../useFirebaseInit';

import { firestore } from '../firestoreWrapper/Firestore';
import { Database } from '../schema';

import type { WithId } from '../firestoreWrapper/type';

const rootCollection = 'restaurants';

export interface Restaurant {
  avgRating: number;
  category: string;
  city: string;
  name: string;
  numRatings: number;
  photo: string;
  price: number;
}

export interface IndexProps {
  user: UserCredential | undefined;
}

export const Index: React.FC<IndexProps> = ({ user }) => {
  const [data, setData] = useState<WithId<Restaurant>[]>([]);

  useEffect(() => {
    if (user === undefined) return;

    firestore<Database>()
      .collection(rootCollection)
      .orderBy('avgRating', 'desc')
      .limit(5)
      .onSnapshot((snapshot) => {
        if (!snapshot.size) return null;

        snapshot.docChanges().forEach((change) => {
          if (change.type === 'removed') {
            setData((pDocs) =>
              pDocs.filter((pDoc) => pDoc._id !== change.doc.id)
            );
          } else {
            const changeDoc = change.doc;
            setData((pDocs) => {
              const newD = pDocs.filter((pDoc) => pDoc._id !== changeDoc.id);
              return [
                ...newD,
                { _id: changeDoc.id, ...changeDoc.data() } as WithId<
                  Restaurant
                >,
              ];
            });
          }
        });
      });
  }, [user]);

  return (
    <>
      <div>
        Data:
        {data &&
          data.map((d) => (
            <div key={d._id}>
              <Link to={`/restaurant/${d._id}`}>{d._id}</Link>、{d.name}、
              {d.numRatings}、{d.avgRating}
            </div>
          ))}
      </div>
    </>
  );
};
