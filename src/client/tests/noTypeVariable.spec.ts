import { firestoreWithAppSettings } from '../firestoreWrapper/Firestore';
import { WebFirestoreTestUtil } from './util';

const schema = {
  name: 'aaa',
  value: 10,
};
type Schema = typeof schema;

const util = new WebFirestoreTestUtil({ isAdmin: true });
const firestore = firestoreWithAppSettings(util.app, util.settings);

const testData: Schema[] = [
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
  const col = firestore.collection('data').setDocumentType<Schema>();
  const docIds: string[] = [];
  testData.forEach(async (data) => {
    const doc = await col.add(data);
    docIds.push(doc.id);
  });
});

afterAll(async () => {
  await firestore.terminate();
});

describe('[query get]', () => {
  test(`get`, async () => {
    const col = firestore.collection('data').setDocumentType(schema);
    const get = await col.get();
    const data = get.docs.map((doc) => {
      const data = doc.data();
      return { name: data.name, value: data.value };
    });
    expect(data).toEqual(expect.arrayContaining(testData));
  });
});
