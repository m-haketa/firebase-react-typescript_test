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
            _documents: {
              temp: string;
            };
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

beforeAll(async () => {
  const r = firestore.collection('restaurants');
  const rDoc = await r.add({
    category: 'aaa',
    avgRating: 5,
  });

  const rr = r.doc(rDoc.id).collection('ratings');
  const rrDoc = await rr.add({
    rating: 5,
    text: 'bbb',
    ok: true,
  });

  const rrx = rr.doc(rrDoc.id).collection('xxx');
  const rrxDoc = await rrx.add({
    temp: 'ccc',
  });

  const rrxr = rrx.doc(rrxDoc.id).collection('ratings');
  await rrxr.add({
    date: st('2020-05-22'),
    rating: 4,
    text: 'rrxr',
  });

  const s = firestore.collection('shops');
  const sDoc = await s.add({
    avgRating: 3,
    category: 'ddd',
  });

  const sr = s.doc(sDoc.id).collection('ratings');
  await sr.add({
    rating: 3,
    text: 'eee',
  });
});

afterAll(async () => {
  await firestore.terminate();
});

describe('[collection groups]', () => {
  test('collection groups', async () => {
    const query = firestore.collectionGroup('ratings');

    const expectData = [
      {
        rating: 5,
        text: 'bbb',
        ok: true,
      },
      {
        date: st('2020-05-22'),
        rating: 4,
        text: 'rrxr',
      },
      { rating: 3, text: 'eee' },
    ];

    const data = await query.get();
    data.forEach((d) => {
      const dd = d.data();
      console.log(dd);
      if ('ok' in dd) {
        expect(dd).toEqual(expectData[0]);
        return;
      }

      if ('date' in dd) {
        expect(dd).toEqual(expectData[1]);
        return;
      }

      expect(dd).toEqual(expectData[2]);
    });
  });
});
