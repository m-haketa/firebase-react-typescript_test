import React from 'react';
import { useParams } from 'react-router-dom';

import { useEffect, useState } from 'react';
import * as firebase from 'firebase';

import type { UserCredential } from '../useFirebaseInit';

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

interface RestaurantProps {
  user: UserCredential | undefined;
}

export const Restaurant: React.FC<RestaurantProps> = ({ user }) => {
  const { restaurant_id } = useParams();

  const [restaurant, setRestaurant] = useState({});

  useEffect(() => {
    if (user === undefined) return;

    console.log(`${restaurant_id}`);
    if (restaurant_id === undefined) return;

    firebase
      .firestore()
      .collection(`restaurants`)
      .doc(`${restaurant_id}`)
      .get()
      .then((ret) => {
        if (ret === undefined) return;

        const data = ret.data();
        console.log(`${data}`);

        if (data === undefined) return;
        setRestaurant(data);
      })
      .catch((e) => {
        console.log(`error: ${e}`);
      });
  }, [user, restaurant_id, setRestaurant]);

  return <div>restaurant_id:{restaurant_id}</div>;
};
