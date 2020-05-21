import * as firebase from 'firebase';

import { CollectionReference } from './CollectionReference';
import type { DatabaseType } from './types';

class Firestore<D extends DatabaseType = DatabaseType> {
  constructor(private impl: firebase.firestore.Firestore) {}

  get app(): firebase.app.App {
    return this.impl.app;
  }

  collection<K extends keyof D>(
    collectionPath: string & K
  ): CollectionReference<D[K]['_documents'], D[K]['_collections']> {
    return new CollectionReference<D[K]['_documents'], D[K]['_collections']>(
      this.impl.collection(collectionPath)
    );
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

  settings(settings: firebase.firestore.Settings): void {
    this.impl.settings(settings);
  }

  enablePersistence(
    settings?: firebase.firestore.PersistenceSettings
  ): Promise<void> {
    return this.impl.enablePersistence(settings);
  }

  clearPersistence(): Promise<void> {
    return this.impl.clearPersistence();
  }

  waitForPendingWrites(): Promise<void> {
    return this.impl.waitForPendingWrites();
  }

  onSnapshotsInSync(observer: {
    next?: (value: void) => void;
    error?: (error: Error) => void;
    complete?: () => void;
  }): () => void;
  onSnapshotsInSync(onSync: () => void): () => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSnapshotsInSync(params: any): () => void {
    return this.impl.onSnapshotsInSync(params);
  }

  /*
  doc(documentPath: string): DocumentReference<DocumentData>;
  collectionGroup(collectionId: string): Query<DocumentData>;
  runTransaction<T>(
    updateFunction: (transaction: Transaction) => Promise<T>
  ): Promise<T>;
  batch(): WriteBatch;
  INTERNAL: { delete: () => Promise<void> };
  */
}

export const firestore = <D extends DatabaseType = DatabaseType>(
  app?: firebase.app.App,
  settings?: firebase.firestore.Settings
): Firestore<D> => {
  const firestore = firebase.firestore(app);
  if (settings) {
    firestore.settings(settings);
  }
  return new Firestore<D>(firestore);
};
