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

const sortValue = (a: { value: number }, b: { value: number }): number =>
  a.value > b.value ? 1 : a.value === b.value ? 0 : -1;

beforeAll(async () => {
  const col = firestore.collection('data');
  testData.forEach((data) => {
    col.add(data);
  });
});

afterAll(async () => {
  await firestore.terminate();
});

describe('[query get]', () => {
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

describe('[query fetch]', () => {
  test(`fetch`, async () => {
    const data = await firestore.collection('data').fetch();
    console.log(data);

    const sortedData = data.sort(sortValue);
    const sortedTestData = testData.sort(sortValue);

    for (let c = 0; c < sortedData.length; c++) {
      expect(sortedData[c]).toEqual({
        name: sortedTestData[c].name,
        value: sortedTestData[c].value,
        _id: expect.anything(),
      });
    }
  });
});
