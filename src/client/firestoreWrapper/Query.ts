import * as firebase from 'firebase';

import type { DocumentProps, WithId } from './type';

export class Query<D, U> {
  constructor(
    private qImpl: firebase.firestore.Query,
    protected decoder?: (dbData: D) => Partial<U>,
    protected encoder?: (userData: U) => Partial<D>
  ) {}

  get(
    options?: firebase.firestore.GetOptions
  ): Promise<firebase.firestore.QuerySnapshot<DocumentProps<D>>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.qImpl.get(options) as any;
  }

  fetch(
    options?: firebase.firestore.GetOptions
  ): Promise<WithId<DocumentProps<U>>[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.qImpl.get(options).then((get) => {
      if (get.docs === undefined) return [];
      return get.docs.map((doc) => {
        const data = doc.data();
        const decoded = this.decoder ? this.decoder(data as D) : data;
        return { _id: doc.id, ...data, ...decoded };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any;
    });
  }

  where(
    fieldPath: string | firebase.firestore.FieldPath,
    opStr: firebase.firestore.WhereFilterOp,
    value: unknown
  ): Query<D, U> {
    return new Query<D, U>(this.qImpl.where(fieldPath, opStr, value));
  }

  orderBy(
    fieldPath: string | firebase.firestore.FieldPath,
    directionStr?: firebase.firestore.OrderByDirection
  ): Query<D, U> {
    return new Query<D, U>(this.qImpl.orderBy(fieldPath, directionStr));
  }

  limit(limit: number): Query<D, U> {
    return new Query<D, U>(this.qImpl.limit(limit));
  }

  limitToLast(limit: number): Query<D, U> {
    return new Query<D, U>(this.qImpl.limitToLast(limit));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startAt(snapshot: firebase.firestore.DocumentSnapshot<any>): Query<D, U>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startAt(...fieldValues: any[]): Query<D, U>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startAt(...params: any[]): Query<D, U> {
    return new Query<D, U>(this.qImpl.startAt(...params));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startAfter(snapshot: firebase.firestore.DocumentSnapshot<any>): Query<D, U>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startAfter(...fieldValues: any[]): Query<D, U>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startAfter(...params: any[]): Query<D, U> {
    return new Query<D, U>(this.qImpl.startAfter(...params));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  endBefore(snapshot: firebase.firestore.DocumentSnapshot<any>): Query<D, U>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  endBefore(...fieldValues: any[]): Query<D, U>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  endBefore(...params: any[]): Query<D, U> {
    return new Query<D, U>(this.qImpl.endBefore(...params));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  endAt(snapshot: firebase.firestore.DocumentSnapshot<any>): Query<D, U>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  endAt(...fieldValues: any[]): Query<D, U>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  endAt(...params: any[]): Query<D, U> {
    return new Query<D, U>(this.qImpl.endAt(...params));
  }

  isEqual(other: Query<D, U>): boolean {
    return this.qImpl.isEqual(other.qImpl);
  }

  /* query
  readonly firestore: Firestore;
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
