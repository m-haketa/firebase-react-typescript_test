import type { Timestamp, DocumentProps } from './firestoreWrapper/type';
import { firestore as f } from './firestoreWrapper/Firestore';

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

type Test = DocumentProps<Database['restaurants']>;

const firestore = f<Database>();

const col = firestore.collection('restaurants');

const nextCol = col.doc('aaa').collection('ratings');

async () => {
  const data = await col.get();
  const docs = data.docs;
  docs[0].data().avgRating;
};

async () => {
  const document = col.doc('abcde');
  const data = await document.get();
  const docs = data.data();
  docs?.category;
};
