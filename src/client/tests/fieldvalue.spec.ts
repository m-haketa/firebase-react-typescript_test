import { firestore as f } from '../firestoreWrapper/Firestore';
import { WebFirestoreTestUtil } from './testUtils';

import { stringToTimestamp as st } from '../schema';

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
      value2: 20,
      arr: [] as string[],
      arr2: [] as number[],
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
      value2: 10,
      arr: ArrayUnion('abc', 'def'),
      arr2: ArrayRemove(10),
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
      value2: 10,
      arr: ['abc', 'def'],
      arr2: [],
      obj: {
        a: 1,
        b: '20',
        c: st('2018-05-01'),
        arr: [1, 2, 3],
      },
    });
  });
});

test('update doc', async () => {
  const col = firestore.collection('dataforadd');

  const data = {
    timestamp: ServerTimestamp(),
    value: 5,
    value2: 2,
    arr: ArrayUnion('ghi', 'jkl'),
    arr2: ArrayUnion(10, 20),
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
    value2: Increment(1),
    arr: ArrayUnion('mno', 'p'),
    arr2: ArrayRemove(10, 15),
    obj: {
      a: 8,
      b: '60',
    },
  });

  expect((await doc.get()).data()).toEqual({
    timestamp: expect.anything(),
    value: 8,
    value2: 3,
    arr: ['ghi', 'jkl', 'mno', 'p'],
    arr2: [20],
    obj: {
      a: 8,
      b: '60',
      //c: st('2018-05-01'),
      //arr: [10, 20],
    },
  });
});
