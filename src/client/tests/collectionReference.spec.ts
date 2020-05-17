import { firestoreWithAppSettings as f } from '../firestoreWrapper/Firestore';

import * as firebase from 'firebase';
import firebaseConfig from '../firebase_config.json';

import { WebFirestoreTestUtil } from './util';

import { Database, timestampDecoder, timestampEncoder } from '../schema';

const util = new WebFirestoreTestUtil({ isAdmin: false });

const app = util.app;
const settings = util.settings;
//const app = undefined;
//const settings = {};

const firestore = f<Database>(app, settings);

beforeAll(async () => {
  //firebase.initializeApp(firebaseConfig);
  //await firebase.auth().signInAnonymously();
});

afterAll(async () => {
  await firestore.terminate();
});

describe('[collection compare test]', () => {
  test(`compareで一致するか`, () => {
    const col1 = firestore
      .collection(`restaurants`)
      .doc(`uLiRemeCK1pAVkFAJCpR`)
      .collection(`ratings`);

    const col2 = firestore
      .collection(`restaurants`)
      .doc(`uLiRemeCK1pAVkFAJCpR`)
      .collection(`ratings`);

    expect(col1.isEqual(col2)).toBe(true);
  });
});

describe('[document path]', () => {
  test(`document pathを取得`, () => {
    const c1 = `restaurants`;
    const d1 = `wbZBOzeVDOmSEOMCemxs`;
    const c2 = `ratings`;
    const d2 = `Pp0D79YzR750kelslQVG`;

    const doc1 = firestore.collection(c1).doc(d1).collection(c2).doc(d2);

    console.log(doc1.path);
    expect(doc1.path).toBe(`${c1}/${d1}/${c2}/${d2}`);
  });
});

describe('[add test]', () => {
  test(`restaurantsをadd`, async () => {
    expect.assertions(2);

    const col = firestore.collection(`restaurants`);

    const doc: Parameters<typeof col['add']>[0] = {
      category: 'Brunch',
      city: 'San Francisco',
      name: 'Best Bar',
      photo:
        'https://storage.googleapis.com/firestorequickstarts.appspot.com/food_8.png',
      price: 3,
      avgRating: 0,
      numRatings: 0,
    };

    const addedDocId = await col.add(doc);

    console.log(`docId:${addedDocId.id}`);

    const fetchedDoc = await col.doc(addedDocId.id).get();

    const data = fetchedDoc.data();
    expect(data).toEqual(doc);

    const colRating = firestore
      .collection(`restaurants`)
      .doc(addedDocId.id)
      .collection(`ratings`)
      .withConverter(timestampDecoder, timestampEncoder);

    const docRating: Parameters<typeof colRating['add']>[0] = {
      rating: 1,
      text: 'good!',
      timestamp: '2020-05-17',
      userId: 'test-user',
      userName: 'test-user',
    };

    console.log({ docRating });
    const addedRatingDoc = await colRating.add(docRating).catch((e) => {
      console.log(e.toString());
      throw e;
    });

    console.log(`ratingDocId:${addedRatingDoc.id}`);

    const fetchedRating = await colRating
      .doc(addedRatingDoc.id)
      .fetch()
      .catch((e) => {
        console.log(e.toString());
        throw e;
      });

    expect(fetchedRating).toEqual({ ...docRating, _id: addedRatingDoc.id });
  });
});
