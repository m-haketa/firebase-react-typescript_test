import * as firebase from 'firebase';

import { CollectionReference } from './CollectionReference';

class Firestore<D> {
  private impl: firebase.firestore.Firestore;

  constructor(app?: firebase.app.App) {
    this.impl = firebase.firestore(app);
  }

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

export const firestore = <D>(app?: firebase.app.App): Firestore<D> => {
  return new Firestore<D>(app);
};
