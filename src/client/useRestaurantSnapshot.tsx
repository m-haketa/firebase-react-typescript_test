import { useEffect, useState } from 'react';

import * as firebase from 'firebase';

import { firestore } from './firestoreWrapper/Firestore';
import { Database } from './schema';

import { WithId, DocumentProps as DP } from './firestoreWrapper/types';

export type Restaurant = WithId<DP<Database['restaurants']>>;

export const useRestaurantSnapshot = (
  user: firebase.auth.UserCredential | undefined
): [Restaurant[]] => {
  const [data, setData] = useState<Restaurant[]>([]);

  useEffect(() => {
    if (user === undefined) return;

    const cancelSnapshot = firestore<Database>()
      .collection('restaurants')
      .orderBy('avgRating', 'desc')
      .limit(5)
      .fetchSnapshot((snapshotData) => {
        setData(snapshotData);
      });

    return cancelSnapshot;
  }, [user]);

  return [data];
};
