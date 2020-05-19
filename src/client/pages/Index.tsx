import React from 'react';
import { Link } from 'react-router-dom';

import type { UserCredential } from '../useFirebaseInit';

import { useRestaurantSnapshot } from '../useRestaurantSnapshot';

export interface IndexProps {
  user: UserCredential | undefined;
}

export const Index: React.FC<IndexProps> = ({ user }) => {
  const [data] = useRestaurantSnapshot(user);

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
