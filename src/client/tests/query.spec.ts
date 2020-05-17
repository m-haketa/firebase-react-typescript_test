import { firestoreWithAppSettings } from '../firestoreWrapper/Firestore';
import { WebFirestoreTestUtil } from './util';

import { timestampDecoder, timestampEncoder } from '../schema';
import type { DocumentProps } from '../firestoreWrapper/type';

//schema定義（まずは、具体的な値で）
//作成するときには、いったん、DatabaseType型で作成すると、制約がかかるので書きやすい
//import type { DatabaseType } from '../firestoreWrapper/type';
const schema /* :DatabaseType */ = {
  data: {
    _documents: {
      name: 'aaa',
      value: 10,
    },
    _collections: {
      subdata: {
        _documents: {
          name: 'aaa',
          value: 10,
        },
        _collections: {},
      },
    },
  },
};
type Schema = typeof schema;

const util = new WebFirestoreTestUtil({ isAdmin: true });
const firestore = firestoreWithAppSettings<Schema>(util.app, util.settings);

const testData: DocumentProps<Schema['data']>[] = [
  { name: 'abc', value: 10 },
  { name: 'def', value: 40 },
  { name: 'ghi', value: 20 },
  { name: 'jkl', value: 50 },
  { name: 'mno', value: 30 },
  { name: 'pqr', value: 60 },
  { name: 'stu', value: 0 },
  { name: 'vwx', value: -10 },
  { name: 'yza', value: 80 },
  { name: 'bcd', value: 15 },
];

beforeAll(async () => {
  const col = firestore.collection('data');
  testData.forEach((data) => {
    col.add(data);
  });
});

afterAll(async () => {
  await firestore.terminate();
});

describe('[query test]', () => {
  test(`get`, async () => {
    const get = await firestore.collection('data').get();
    const data = get.docs.map((doc) => {
      const data = doc.data();
      return { name: data.name, value: data.value };
    });
    console.log(data);
    expect(data).toEqual(expect.arrayContaining(testData));
  });
});
