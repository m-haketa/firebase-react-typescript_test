// import fs from 'fs'
import * as firebase from '@firebase/testing';
import crypto from 'crypto';

// This is workaround for avoid error which occure using firestore.FieldValue.increment() with update() or set()
// FieldValue which from `import { firestore } from 'firebase'` maybe can not use when using local emulator.
// FieldValue which from @firebase/testing is OK. So export it for using FieldValue in each tests.
export const FieldValue = firebase.firestore.FieldValue;

export class WebFirestoreTestUtil {
  projectId: string;
  uid: string;
  app: ReturnType<typeof firebase.initializeTestApp>;
  settings: firebase.firestore.Settings;
  webFirestore: firebase.firestore.Firestore;

  constructor() {
    // Use random projectId to separate emulator firestore namespace for concurrent testing
    const randomStr = crypto.randomBytes(10).toString('hex');
    this.projectId = `test-${randomStr}`;
    this.uid = 'test-user';

    this.app = firebase.initializeTestApp({
      projectId: this.projectId,
      auth: { uid: this.uid },
    });

    this.settings = {
      host: 'localhost:8000',
      ssl: false,
    };

    // Setup web Firestore and admin Firestore with using emulator
    this.webFirestore = this.app.firestore();
    this.webFirestore.settings(this.settings);
  }

  // Clear emulator Firestore data
  // Use in 'afterEach'
  async clearFirestoreData(): Promise<void> {
    await firebase.clearFirestoreData({ projectId: this.projectId });
  }

  // Delete firebase listner
  // Use in 'afterAll'
  async deleteApps(): Promise<void> {
    await Promise.all(firebase.apps().map((app) => app.delete()));
  }
}
