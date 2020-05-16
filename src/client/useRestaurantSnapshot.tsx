import { useEffect, useState } from 'react';

import * as firebase from 'firebase';

import { firestore } from './firestoreWrapper/Firestore';
import { Database } from './schema';

import type { WithId } from './firestoreWrapper/type';

export interface Restaurant {
  avgRating: number;
  category: string;
  city: string;
  name: string;
  numRatings: number;
  photo: string;
  price: number;
}

export const useRestaurantSnapshot = (
  user: firebase.auth.UserCredential | undefined
): [WithId<Restaurant>[]] => {
  const [data, setData] = useState<WithId<Restaurant>[]>([]);

  useEffect(() => {
    if (user === undefined) return;

    firestore<Database>()
      .collection('restaurants')
      .orderBy('avgRating', 'desc')
      .limit(5)
      .fetchSnapshot((snapshotData) => {
        setData(snapshotData);
      });
  }, [user]);

  return [data];
};
