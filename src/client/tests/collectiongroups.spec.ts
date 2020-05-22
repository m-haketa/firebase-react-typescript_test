import { firestore as f } from '../firestoreWrapper/Firestore';
import { WebFirestoreTestUtil } from './testUtils';

import { stringToTimestamp as st } from '../schema';

import { Timestamp } from '../firestoreWrapper/types';

export type Database = {
  restaurants: {
    _documents: {
      avgRating: number;
      category: string;
    };
    _collections: {
      ratings: {
        _documents: {
          rating: number;
          text: string;
          ok: boolean;
        };
        _collections: {
          xxx: {
            _documents: {};
            _collections: {
              ratings: {
                _documents: {
                  rating: number;
                  text: string;
                  date: Timestamp;
                };
                _collections: {};
              };
            };
          };
        };
      };
    };
  };
  shops: {
    _documents: {
      avgRating: number;
      category: string;
    };
    _collections: {
      ratings: {
        _documents: {
          rating: number;
          text: string;
        };
        _collections: {};
      };
    };
  };
};

const util = new WebFirestoreTestUtil({ isAdmin: true });
const firestore = f<Database>(util.app, util.settings);

//beforeAll(async () => {});

afterAll(async () => {
  await firestore.terminate();
});

describe('[collection groups]', () => {
  test('collection groups', async () => {
    const query = firestore.collectionGroup('ratings');
  });
});
