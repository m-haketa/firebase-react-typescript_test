import * as firebase from 'firebase';

import { CollectionReference } from './CollectionReference';
import type { DatabaseType } from './type';

class Firestore<D extends DatabaseType = DatabaseType> {
  constructor(private impl: firebase.firestore.Firestore) {}

  collection<K extends keyof D>(
    collectionPath: string & K
  ): CollectionReference<D[K]> {
    return new CollectionReference<D[K]>(this.impl.collection(collectionPath));
  }

  enableNetwork(): Promise<void> {
    return this.impl.enableNetwork();
  }

  disableNetwork(): Promise<void> {
    return this.impl.disableNetwork();
  }

  terminate(): Promise<void> {
    return this.impl.terminate();
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
  waitForPendingWrites(): Promise<void>;
  onSnapshotsInSync(observer: {
    next?: (value: void) => void;
    error?: (error: Error) => void;
    complete?: () => void;
  }): () => void;
  onSnapshotsInSync(onSync: () => void): () => void;
  INTERNAL: { delete: () => Promise<void> };
  */
}

export const firestoreWithAppSettings = <D extends DatabaseType = DatabaseType>(
  app?: firebase.app.App,
  settings?: firebase.firestore.Settings
): Firestore<D> => {
  const firestore = firebase.firestore(app);
  if (settings) {
    firestore.settings(settings);
  }
  return new Firestore<D>(firestore);
};

export const firestore = <D extends DatabaseType = DatabaseType>(): Firestore<
  D
> => {
  return firestoreWithAppSettings<D>();
};
