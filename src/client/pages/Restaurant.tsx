import React from 'react';
import { useParams } from 'react-router-dom';

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
  dummy?: string;
}

export const Restaurant: React.FC<RestaurantProps> = (props) => {
  const { restaurant_id: restaurant_id_str } = useParams();
  return <div>restaurant_id:{restaurant_id_str}</div>;
};
