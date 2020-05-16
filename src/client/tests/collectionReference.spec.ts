import { firestore as f } from '../firestoreWrapper/Firestore';

import { WebFirestoreTestUtil, FieldValue } from './util';

import { Database } from '../schema';

const util = new WebFirestoreTestUtil();
const collectionPath = 'basic';

const firestore = f<Database>(util.app);

beforeEach(async () => {
  //firebase.initializeApp(firebaseConfig);
  //await firebase.auth().signInAnonymously();
});

describe('[collection compare test]', () => {
  test(`compareで一致するか`, async () => {
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
  test(`document pathを取得`, async () => {
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

/*
describe('[add test]', () => {
  test(`restaurantの口コミをadd`, () => {
    const firestore = f<Database>();

    const col = firestore
      .collection(`restaurants`)
      .doc(`uLiRemeCK1pAVkFAJCpR`)
      .collection(`ratings`);

    expect(col).toBe();
  });
});
*/
