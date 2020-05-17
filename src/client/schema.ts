import { format } from 'date-fns/fp';
import firebase from 'firebase';

import type { Decoder, Encoder, Timestamp } from './firestoreWrapper/type';

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

export const timestampDecoder: Decoder<
  { timestamp: Timestamp },
  { timestamp: string }
> = ({ timestamp }) => ({
  timestamp: format('yyyy-MM-dd')(timestamp.toDate()),
});

export const timestampEncoder: Encoder<
  { timestamp: Timestamp },
  { timestamp: string }
> = ({ timestamp }) => ({
  timestamp: new firebase.firestore.Timestamp(
    new Date(timestamp).getTime() / 1000,
    0
  ),
});
