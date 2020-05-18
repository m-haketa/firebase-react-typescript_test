import { firestoreWithAppSettings } from '../firestoreWrapper/Firestore';
import { WebFirestoreTestUtil } from './util';

import * as R from 'ramda';

import {
  stringToTimestamp as st,
  timestampDecoder,
  timestampEncoder,
} from '../schema';
import type { DocumentProps, CollectionProps } from '../firestoreWrapper/type';

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
          timestamp: st('2020-05-10'),
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

const testData2: DocumentProps<
  CollectionProps<Schema['data']>['subdata']
>[][] = [
  [
    { name: 'AAA', timestamp: st('2020-05-10') },
    { name: 'BBB', timestamp: st('2020-05-11') },
  ],
  [
    { name: 'CCC', timestamp: st('2020-05-12') },
    { name: 'DDD', timestamp: st('2020-05-13') },
  ],
  [
    { name: 'EEE', timestamp: st('2020-05-14') },
    { name: 'FFF', timestamp: st('2020-05-15') },
  ],
  [
    { name: 'GGG', timestamp: st('2020-05-16') },
    { name: 'HHH', timestamp: st('2020-05-17') },
  ],
  [
    { name: 'III', timestamp: st('2020-05-18') },
    { name: 'JJJ', timestamp: st('2020-05-19') },
  ],
  [
    { name: 'KKK', timestamp: st('2020-05-20') },
    { name: 'LLL', timestamp: st('2020-04-20') },
  ],
  [
    { name: 'MMM', timestamp: st('2020-03-20') },
    { name: 'NNN', timestamp: st('2020-02-20') },
  ],
  [
    { name: 'OOO', timestamp: st('2020-01-20') },
    { name: 'PPP', timestamp: st('2019-12-20') },
  ],
  [
    { name: 'QQQ', timestamp: st('2019-11-20') },
    { name: 'RRR', timestamp: st('2019-10-20') },
  ],
  [
    { name: 'SSS', timestamp: st('2019-09-20') },
    { name: 'TTT', timestamp: st('2019-08-20') },
  ],
];

const sortValue = (a: { value: number }, b: { value: number }): number =>
  a.value > b.value ? 1 : a.value === b.value ? 0 : -1;

beforeAll(async () => {
  const col = firestore.collection('data');
  const docIds: string[] = [];
  testData.forEach(async (data) => {
    const doc = await col.add(data);
    docIds.push(doc.id);
  });

  const docIdAndDatas = R.zip(docIds, testData2);
  docIdAndDatas.map(([docId, datas]) => {
    const subCol = col.doc(docId).collection('subdata');
    datas.forEach((data) => subCol.add(data));
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

    const zipped = R.zip(sortedData, sortedTestData);
    zipped.map(([d, td]) =>
      expect(d).toEqual({
        name: td.name,
        value: td.value,
        _id: expect.anything(),
      })
    );
  });
});

describe('[query where]', () => {
  test(`where`, async () => {
    const data = await firestore
      .collection('data')
      .where('value', '==', 80)
      .fetch();
    console.log(data);

    expect(data).toEqual([
      {
        name: 'yza',
        value: 80,
        _id: expect.anything(),
      },
    ]);
  });
});

describe('[query orderBy]', () => {
  test(`orderBy`, async () => {
    const data = await firestore
      .collection('data')
      .orderBy('value', 'asc')
      .fetch();
    console.log(data);

    const sortedTestData = testData.sort(sortValue);

    const zipped = R.zip(data, sortedTestData);
    zipped.map(([d, td]) =>
      expect(d).toEqual({
        name: td.name,
        value: td.value,
        _id: expect.anything(),
      })
    );
  });
});

describe('[query limit]', () => {
  test(`limit`, async () => {
    const data = await firestore
      .collection('data')
      .orderBy('value', 'asc')
      .limit(5)
      .fetch();
    console.log(data);

    const sortedTestData = testData.sort(sortValue);

    //dataの件数分（＝5件）zipする
    const zipped = R.zip(data, sortedTestData);
    zipped.map(([d, td]) =>
      expect(d).toEqual({
        name: td.name,
        value: td.value,
        _id: expect.anything(),
      })
    );
  });
});

describe('[query limitToLast]', () => {
  test(`limitToLast`, async () => {
    const data = await firestore
      .collection('data')
      .orderBy('value', 'asc')
      .limitToLast(5)
      .fetch();
    console.log(data);

    //dataはascでsort後最後の5件。それを逆順にする
    const sortedData = data.reverse();

    //testDataもascでsort後逆順にする。これで、先頭5件は一致するはず
    const sortedTestData = testData.sort(sortValue).reverse();

    //sortedDataの件数分（＝5件）zipする
    const zipped = R.zip(sortedData, sortedTestData);
    zipped.map(([d, td]) =>
      expect(d).toEqual({
        name: td.name,
        value: td.value,
        _id: expect.anything(),
      })
    );
  });
});

describe('[query withConverter]', () => {
  test(`withConverter`, async () => {
    const baseDoc = await firestore
      .collection('data')
      .where('name', '==', 'abc')
      .fetch();

    const fetchedData = await firestore
      .collection('data')
      .doc(baseDoc[0]._id)
      .collection('subdata')
      .withConverter(timestampDecoder, timestampEncoder)
      .fetch();

    const expectedData = [
      { name: 'AAA', timestamp: '2020-05-10' },
      { name: 'BBB', timestamp: '2020-05-11' },
    ];

    //sortedDataの件数分（＝5件）zipする
    const zipped = R.zip(fetchedData, expectedData);
    zipped.map(([d, td]) =>
      expect(d).toEqual({
        name: td.name,
        timestamp: td.timestamp,
        _id: expect.anything(),
      })
    );
  });
});
