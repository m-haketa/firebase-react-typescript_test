import { firestoreWithAppSettings as f } from '../firestoreWrapper/Firestore';

import * as firebase from 'firebase';
import firebaseConfig from '../firebase_config.json';

import { WebFirestoreTestUtil, FieldValue } from './util';

import { Database } from '../schema';

const util = new WebFirestoreTestUtil();

const app = util.app;
const settings = util.settings;
//const app = undefined;
//const settings = {};

const firestore = f<Database>(app, settings);

beforeAll(async () => {
  //await firestore.enableNetwork;
  //firebase.initializeApp(firebaseConfig);
  //await firebase.auth().signInAnonymously();
});

afterAll(async () => {
  await firestore.terminate();
});

describe('[collection compare test]', () => {
  test(`compareで一致するか`, () => {
    /*
    const firestoreOrig = firebase.firestore();

    const col1orig = firestoreOrig
      .collection(`restaurants`)
      .doc(`uLiRemeCK1pAVkFAJCpR`)
      .collection(`ratings`);

    const col2orig = firestoreOrig
      .collection(`restaurants`)
      .doc(`uLiRemeCK1pAVkFAJCpR`)
      .collection(`ratings`);
    */
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
    /*
    const firestoreOrig = firebase.firestore();

    const doc1orig = firestoreOrig
      .collection(`restaurants`)
      .doc(`wbZBOzeVDOmSEOMCemxs`)
      .collection(`ratings`)
      .doc(`Pp0D79YzR750kelslQVG`);
    */

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
    expect.assertions(1);

    const col = firestore.collection(`restaurants`);

    const doc = {
      category: 'Brunch',
      city: 'San Francisco',
      name: 'Best Bar',
      photo:
        'https://storage.googleapis.com/firestorequickstarts.appspot.com/food_8.png',
      price: 3,
      avgRating: 0,
      numRatings: 0,
    };

    const addedDocId = await col.add(doc).catch((e) => {
      console.log(e.toString());
      throw e;
    });
    console.log(`docId:${addedDocId.id}`);

    const fetchedDoc = await col
      .doc(addedDocId.id)
      .get()
      .catch((e) => {
        console.log(e.toString());
        throw e;
      });

    const data = fetchedDoc.data();
    expect(data).toEqual({
      category: doc.category,
      city: doc.city,
      name: doc.name,
      photo: doc.photo,
      price: doc.price,
      avgRating: doc.avgRating,
      numRatings: doc.numRatings,
    });
  });
  /*
  test(`restaurantsをadd`, async () => {
    expect.assertions(1);

    const firestore = f<Database>(app);
    const col = firestore.collection(`restaurants`);

    const doc = {
      category: 'Brunch',
      city: 'San Francisco',
      name: 'Best Bar',
      photo:
        'https://storage.googleapis.com/firestorequickstarts.appspot.com/food_8.png',
      price: 3,
      avgRating: 0,
      numRatings: 0,
    };

    const addedDocId = await col.add(doc).catch((e) => {
      console.log(e.toString());
      throw e;
    });
    console.log(`docId:${addedDocId.id}`);

    const fetchedDoc = await col
      .doc(addedDocId.id)
      .fetch()
      .catch((e) => {
        console.log(e.toString());
        throw e;
      });

    expect(fetchedDoc).toEqual({
      _id: addedDocId.id,
      category: doc.category,
      city: doc.city,
      name: doc.name,
      photo: doc.photo,
      price: doc.price,
      avgRating: doc.avgRating,
      numRatings: doc.numRatings,
    });
  });
  */
  /*
  test(`restaurantの口コミをadd`, () => {
    const firestore = f<Database>();

    const col = firestore
      .collection(`restaurants`)
      .doc(`uLiRemeCK1pAVkFAJCpR`)
      .collection(`ratings`);

    expect(col).toBe();
  });
  */
});
