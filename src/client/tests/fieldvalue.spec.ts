import { firestore as f } from '../firestoreWrapper/Firestore';
import { WebFirestoreTestUtil } from './testUtils';

import * as R from 'ramda';

import { stringToTimestamp as st, timestampToYMDString } from '../schema';

import {
  ServerTimestamp,
  Increment,
  ArrayUnion,
  ArrayRemove,
} from '../firestoreWrapper/types';

//schema定義（まずは、具体的な値で）
//作成するときには、いったん、DatabaseType型で作成すると、制約がかかるので書きやすい
//import type { DatabaseType } from '../firestoreWrapper/type';
const schema /* :DatabaseType */ = {
  dataforadd: {
    _documents: {
      timestamp: st('2020-05-10'),
      value: 10,
      arr: [] as string[],
      obj: {
        a: 10,
        b: 'a',
        c: st('2020-05-10'),
        arr: [] as number[],
      },
    },
    _collections: {},
  },
};
type Schema = typeof schema;

const util = new WebFirestoreTestUtil({ isAdmin: true });
const firestore = f<Schema>(util.app, util.settings);

//beforeAll(async () => {});

afterAll(async () => {
  await firestore.terminate();
});

describe('[server timestamp]', () => {
  test('add collection', async () => {
    const col = firestore.collection('dataforadd');

    const data = {
      timestamp: ServerTimestamp(),
      value: Increment(2),
      arr: ArrayUnion('abc', 'def'),
      obj: {
        a: 1,
        b: '20',
        c: st('2018-05-01'),
        arr: [1, 2, 3],
      },
    };

    const doc = await col.add(data);

    expect((await doc.get()).data()).toEqual({
      timestamp: expect.anything(),
      value: 2,
      arr: ['abc', 'def'],
      obj: {
        a: 1,
        b: '20',
        c: st('2018-05-01'),
        arr: [1, 2, 3],
      },
    });
  });
});

test('update collection', async () => {
  const col = firestore.collection('dataforadd');

  const data = {
    timestamp: ServerTimestamp(),
    value: 5,
    arr: ArrayUnion('ghi', 'jkl'),
    obj: {
      a: 6,
      b: '40',
      c: st('2018-05-01'),
      arr: [10, 20],
    },
  };

  const doc = await col.add(data);

  await doc.update({
    timestamp: ServerTimestamp(),
    value: Increment(3),
    arr: ArrayUnion('mno', 'p'),
    obj: {
      a: 8,
      b: '60',
      c: st('2018-05-05'),
      arr: [5],
    },
  });

  expect((await doc.get()).data()).toEqual({
    timestamp: expect.anything(),
    value: 8,
    arr: ['ghi', 'jkl', 'mno', 'p'],
    obj: {
      a: 8,
      b: '60',
      c: st('2018-05-05'),
      arr: [5],
    },
  });
});
