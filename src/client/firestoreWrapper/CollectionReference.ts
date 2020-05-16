import * as firebase from 'firebase';

import { Query } from './Query';
import { DocumentReference } from './DocumentReference';

export class CollectionReference<D, U = D> extends Query<D, U> {
  constructor(private cImpl: firebase.firestore.CollectionReference) {
    super(cImpl);
  }

  doc(documentPath?: string): DocumentReference<D, U> {
    return new DocumentReference<D, U>(this.cImpl.doc(documentPath));
  }

  /*
  readonly id: string;
  readonly parent: DocumentReference<DocumentData> | null;
  readonly path: string;
  add(data: T): Promise<DocumentReference<T>>;
  isEqual(other: CollectionReference<T>): boolean;
  withConverter<U>(
    converter: FirestoreDataConverter<U>
  ): CollectionReference<U>;
  */
}
