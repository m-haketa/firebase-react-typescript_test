import React from 'react';

import { useFireBase } from './useFirebaseInit';
import { useFirebaseSnapshot } from './useFirebaseSnapshot';

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

export interface RestaurantRating {
  rating: number;
  text: string;
  timestamp: string;
  userId: string;
  userName: string;
}

export interface RestaurantRatingRet {
  rating: number;
  text: string;
  timestamp: Date;
  userId: string;
  userName: string;
}

export const App: React.FC = () => {
  const user = useFireBase();

  const data = useFirebaseSnapshot<Restaurant>(user, rootCollection, (cRef) =>
    cRef.orderBy('avgRating', 'desc').limit(50)
  );

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
