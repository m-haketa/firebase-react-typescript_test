import * as firebase from 'firebase';
import * as firebaseTesting from '@firebase/testing';

import { CollectionReference } from './CollectionReference';

class Firestore<D = { [key: string]: unknown }> {
  constructor(private impl: firebase.firestore.Firestore) {}

  collection(
    collectionPath: string & keyof D
  ): CollectionReference<D[typeof collectionPath], D[typeof collectionPath]> {
    return new CollectionReference<
      D[typeof collectionPath],
      D[typeof collectionPath]
    >(this.impl.collection(collectionPath));
  }

  /*
  settings(settings: Settings): void;
  enablePersistence(settings?: PersistenceSettings): Promise<void>;
  doc(documentPath: string): DocumentReference<DocumentData>;
  collectionGroup(collectionId: string): Query<DocumentData>;
  runTransaction<T>(
    updateFunction: (transaction: Transaction) => Promise<T>
  ): Promise<T>;
  batch(): WriteBatch;
  app: firebase.app.App;
  clearPersistence(): Promise<void>;
  enableNetwork(): Promise<void>;
  disableNetwork(): Promise<void>;
  waitForPendingWrites(): Promise<void>;
  onSnapshotsInSync(observer: {
    next?: (value: void) => void;
    error?: (error: Error) => void;
    complete?: () => void;
  }): () => void;
  onSnapshotsInSync(onSync: () => void): () => void;
  terminate(): Promise<void>;
  INTERNAL: { delete: () => Promise<void> };
  */
}

export const firestoreWithAppSettings = <D = { [key: string]: unknown }>(
  app?: firebase.app.App,
  settings?: firebase.firestore.Settings
): Firestore<D> => {
  const firestore = firebase.firestore(app);
  if (settings) {
    firestore.settings(settings);
  }
  return new Firestore<D>(firestore);
};

const env = 'dev'; //devかprodを切り替え

export const firestore = <D = { [key: string]: unknown }>(): Firestore<D> => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  if (env === 'prod') {
    return firestoreWithAppSettings<D>();
  } else {
    return firestoreWithAppSettings<D>(
      firebaseTesting.initializeTestApp({
        projectId: 'test',
        auth: { uid: 'testuser' },
      }),
      {
        host: 'localhost:8000',
        ssl: false,
      }
    );
  }
};
