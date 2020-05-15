import React from 'react';

import { useFirebaseSnapshot } from '../useFirebaseSnapshot';

import type { UserCredential } from '../useFirebaseInit';

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
  const [data] = useFirebaseSnapshot<Restaurant>(user, rootCollection, (cRef) =>
    cRef.orderBy('avgRating', 'desc').limit(50)
  );

  return (
    <>
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
