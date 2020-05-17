import type { Timestamp } from './firestoreWrapper/type';

//propsがオブジェクトの場合はcollectionを表す
export interface Database {
  restaurants: {
    avgRating: number;
    category: string;
    city: string;
    name: string;
    numRatings: number;
    photo: string;
    price: number;
    ratings: {
      rating: number;
      text: string;
      timestamp: Timestamp;
      userId: string;
      userName: string;
    };
  };
}
