import { firestoreWithAppSettings } from '../firestoreWrapper/Firestore';
import { WebFirestoreTestUtil } from './util';

import * as R from 'ramda';

import {
  stringToTimestamp as st,
  timestampDecoder,
  timestampEncoder,
} from '../schema';
import type {
  DocumentProps,
  SubCollectionProps,
} from '../firestoreWrapper/type';

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
  data2: {
    _documents: {
      value: 'aaa',
      timestamp: st('2020-05-10'),
    },
    _collections: {},
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

const testData2: DocumentProps<Schema['data2']>[] = [
  { value: 'AAA', timestamp: st('2020-05-10') },
  { value: 'BBB', timestamp: st('2020-05-11') },
  { value: 'CCC', timestamp: st('2020-05-12') },
  { value: 'DDD', timestamp: st('2020-05-13') },
  { value: 'EEE', timestamp: st('2020-05-14') },
  { value: 'FFF', timestamp: st('2020-05-15') },
];

const testData1_1: DocumentProps<
  SubCollectionProps<Schema['data']>['subdata']
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

const sortValue = <T>(a: { value: T }, b: { value: T }): number =>
  a.value > b.value ? 1 : a.value === b.value ? 0 : -1;

beforeAll(async () => {
  const col = firestore.collection('data');
  const docIds: string[] = [];
  testData.forEach(async (data) => {
    const doc = await col.add(data);
    docIds.push(doc.id);
  });

  const docIdAndDatas = R.zip(docIds, testData1_1);
  docIdAndDatas.map(([docId, datas]) => {
    const subCol = col.doc(docId).collection('subdata');
    datas.forEach((data) => subCol.add(data));
  });

  const col2 = firestore.collection('data2');
  testData2.forEach(async (data) => {
    const doc2 = await col2.add(data);
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
    expect(data).toEqual(expect.arrayContaining(testData));
  });
});

describe('[query fetch]', () => {
  test(`fetch`, async () => {
    const data = await firestore.collection('data').fetch();
    const sortedData = data.sort(sortValue);
    const sortedTestData = testData.sort(sortValue);

    expect(data.length).toBe(sortedTestData.length);
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

    const sortedTestData = testData.sort(sortValue);

    expect(data.length).toBe(sortedTestData.length);
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

    //dataはascでsortしたものの最初の5件
    const sortedTestData = testData.sort(sortValue).filter((_, i) => i < 5);

    expect(data.length).toBe(sortedTestData.length);
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

    //dataはascでsort後最後の5件。逆順にして5件を抽出する
    const sortedData = data.reverse().filter((_, i) => i < 5);

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

describe('[query startat]', () => {
  const sortedTestData = testData.filter((v) => v.value >= 50).sort(sortValue);

  const orderedCollection = firestore
    .collection('data')
    .orderBy('value', 'asc');

  test(`startat snapshot`, async () => {
    const snapshot = await firestore
      .collection('data')
      .where('value', '==', 50)
      .get();

    //基準となるドキュメント（valueが50のもの）
    const doc = snapshot.docs[0];
    const data = await orderedCollection.startAt(doc).fetch();

    expect(data.length).toBe(sortedTestData.length);
    const zipped = R.zip(data, sortedTestData);

    zipped.map(([d, td]) =>
      expect(d).toEqual({
        name: td.name,
        value: td.value,
        _id: expect.anything(),
      })
    );
  });

  test(`startat value`, async () => {
    const data = await orderedCollection.startAt(50).fetch();

    expect(data.length).toBe(sortedTestData.length);
    const zipped = R.zip(data, sortedTestData);

    zipped.map(([d, td]) =>
      expect(d).toEqual({
        name: td.name,
        value: td.value,
        _id: expect.anything(),
      })
    );
  });

  test(`startat value object2`, async () => {
    const data = await firestore
      .collection('data')
      .orderBy('value', 'asc')
      .orderBy('name')
      .startAt(50, '1')
      .fetch();

    expect(data.length).toBe(sortedTestData.length);
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

describe('[query withConverter]', () => {
  test(`withConverter`, async () => {
    const fetchedData = await firestore
      .collection('data2')
      .withConverter(timestampDecoder, timestampEncoder)
      .fetch();

    const expected = testData2.map((data) => ({
      ...data,
      ...timestampDecoder(data),
    }));

    expect(fetchedData.length).toBe(expected.length);
    const zipped = R.zip(fetchedData.sort(sortValue), expected.sort(sortValue));

    zipped.map(([d, td]) =>
      expect(d).toEqual({
        value: td.value,
        timestamp: td.timestamp,
        _id: expect.anything(),
      })
    );
  });
});
