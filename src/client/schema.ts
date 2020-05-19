import { format } from 'date-fns/fp';
import firebase from 'firebase';

import type { Decoder, Encoder, Timestamp } from './firestoreWrapper/type';

//propsがオブジェクトの場合はcollectionを表す
export type Database = {
  restaurants: {
    _documents: {
      avgRating: number;
      category: string;
      city: string;
      name: string;
      numRatings: number;
      photo: string;
      price: number;
    };
    _collections: {
      ratings: {
        _documents: {
          rating: number;
          text: string;
          timestamp: Timestamp;
          userId: string;
          userName: string;
        };
        _collections: {};
      };
    };
  };
};

export const timestampToString = (timestamp: Timestamp): string =>
  format('yyyy-MM-dd')(timestamp.toDate());

export const stringToTimestamp = (stringDate: string): Timestamp =>
  firebase.firestore.Timestamp.fromDate(new Date(stringDate));

export const timestampDecoder: Decoder<
  { timestamp: Timestamp },
  { timestamp: string }
> = ({ timestamp }) => ({
  timestamp: timestampToString(timestamp),
});

export const timestampEncoder: Encoder<
  { timestamp: Timestamp },
  { timestamp: string }
> = ({ timestamp }) => ({
  timestamp: stringToTimestamp(timestamp),
});
