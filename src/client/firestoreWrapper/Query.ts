import * as firebase from 'firebase';

import type { DocumentProps, WithId } from './type';

export class Query<D, U> {
  constructor(private qImpl: firebase.firestore.Query) {}

  get(
    options?: firebase.firestore.GetOptions
  ): Promise<firebase.firestore.QuerySnapshot<DocumentProps<D>>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.qImpl.get(options) as any;
  }

  fetch(
    options?: firebase.firestore.GetOptions
  ): Promise<WithId<DocumentProps<D>>[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.qImpl.get(options).then((get) => {
      if (get.docs === undefined) return [];
      return get.docs.map((doc) => ({ _id: doc.id, ...doc.data() })) as any;
    });
  }

  /* query
  readonly firestore: Firestore;
  where(
    fieldPath: string | FieldPath,
    opStr: WhereFilterOp,
    value: any
  ): Query<T>;
  orderBy(
    fieldPath: string | FieldPath,
    directionStr?: OrderByDirection
  ): Query<T>;
  limit(limit: number): Query<T>;
  limitToLast(limit: number): Query<T>;
  startAt(snapshot: DocumentSnapshot<any>): Query<T>;
  startAt(...fieldValues: any[]): Query<T>;
  startAfter(snapshot: DocumentSnapshot<any>): Query<T>;
  startAfter(...fieldValues: any[]): Query<T>;
  endBefore(snapshot: DocumentSnapshot<any>): Query<T>;
  endBefore(...fieldValues: any[]): Query<T>;
  endAt(snapshot: DocumentSnapshot<any>): Query<T>;
  endAt(...fieldValues: any[]): Query<T>;
  isEqual(other: Query<T>): boolean;
  onSnapshot(observer: {
    next?: (snapshot: QuerySnapshot<T>) => void;
    error?: (error: Error) => void;
    complete?: () => void;
  }): () => void;
  onSnapshot(
    options: SnapshotListenOptions,
    observer: {
      next?: (snapshot: QuerySnapshot<T>) => void;
      error?: (error: Error) => void;
      complete?: () => void;
    }
  ): () => void;
  onSnapshot(
    onNext: (snapshot: QuerySnapshot<T>) => void,
    onError?: (error: Error) => void,
    onCompletion?: () => void
  ): () => void;
  onSnapshot(
    options: SnapshotListenOptions,
    onNext: (snapshot: QuerySnapshot<T>) => void,
    onError?: (error: Error) => void,
    onCompletion?: () => void
  ): () => void;
  withConverter<U>(converter: FirestoreDataConverter<U>): Query<U>;
  */
}
