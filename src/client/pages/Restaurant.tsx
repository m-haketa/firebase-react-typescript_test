import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Restaurant as RestaurantType } from './Index';
import type { UserCredential } from '../useFirebaseInit';

import { firestore } from '../firestoreWrapper/Firestore';
import { Database, timestampDecoder } from '../schema';

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

  const [restaurant, setRestaurant] = useState<RestaurantType | undefined>();
  const [ratings, setRatings] = useState<RestaurantRating[]>([]);

  useEffect(() => {
    if (user === undefined) return;

    firestore<Database>()
      .collection('restaurants')
      .doc(restaurant_id)
      .fetch()
      .then((data) => {
        if (data === undefined) return;
        setRestaurant(data);
      })
      .catch((e) => {
        console.log(`error: ${e}`);
      });
  }, [user, restaurant_id, setRestaurant]);

  useEffect(() => {
    if (user === undefined) return;

    console.log(`${restaurant_id}`);
    if (restaurant_id === undefined) return;

    firestore<Database>()
      .collection(`restaurants`)
      .doc(restaurant_id)
      .collection(`ratings`)
      .withDecoder<{ timestamp: string }>(timestampDecoder)
      .fetch()
      .then((ret) => {
        setRatings(ret);
      })
      .catch((e) => {
        console.log(`error: ${e}`);
      });
  }, [user, restaurant_id, setRatings]);

  if (restaurant === undefined) return null;

  return (
    <div>
      restaurant:
      <br />
      {restaurant.city},{restaurant.category},<img src={restaurant.photo} />
      {ratings.length > 0 && (
        <>
          <br />
          ratings:
          <br />
          {ratings.map((rating) => (
            <>
              {rating.userName},{rating.rating},{rating.text},{rating.timestamp}
              <br />
            </>
          ))}
        </>
      )}
    </div>
  );
};
