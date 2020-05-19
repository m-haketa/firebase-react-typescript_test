import * as firebase from 'firebase';

import type {
  Collection,
  DocumentProps,
  WithId,
  Substitute,
  Decoder,
  Encoder,
} from './type';

export class Query<D extends Collection, UDoc = DocumentProps<D>> {
  constructor(
    private qImpl: firebase.firestore.Query,
    protected decoder?: (dbData: Partial<DocumentProps<D>>) => Partial<UDoc>,
    protected encoder?: (userData: Partial<UDoc>) => Partial<DocumentProps<D>>
  ) {}

  get firestore(): firebase.firestore.Firestore {
    return this.qImpl.firestore;
  }

  get(
    options?: firebase.firestore.GetOptions
  ): Promise<firebase.firestore.QuerySnapshot<DocumentProps<D>>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.qImpl.get(options) as any;
  }

  fetch(options?: firebase.firestore.GetOptions): Promise<WithId<UDoc>[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.qImpl.get(options).then((get) => {
      if (get.docs === undefined) return [];
      return get.docs.map((doc) => {
        const data = doc.data();
        const decoded = this.decoder
          ? this.decoder(data as DocumentProps<D>)
          : data;
        return { _id: doc.id, ...data, ...decoded };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any;
    });
  }

  where<T extends keyof DocumentProps<D>>(
    fieldPath: (T & string) | firebase.firestore.FieldPath,
    opStr: firebase.firestore.WhereFilterOp,
    value: DocumentProps<D>[T]
  ): Query<D, UDoc> {
    return new Query<D, UDoc>(this.qImpl.where(fieldPath, opStr, value));
  }

  orderBy<T extends keyof DocumentProps<D>>(
    fieldPath: (T & string) | firebase.firestore.FieldPath,
    directionStr?: firebase.firestore.OrderByDirection
  ): Query<D, UDoc> {
    return new Query<D, UDoc>(this.qImpl.orderBy(fieldPath, directionStr));
  }

  limit(limit: number): Query<D, UDoc> {
    return new Query<D, UDoc>(this.qImpl.limit(limit));
  }

  limitToLast(limit: number): Query<D, UDoc> {
    return new Query<D, UDoc>(this.qImpl.limitToLast(limit));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startAt(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    snapshot: firebase.firestore.DocumentSnapshot<any>
  ): Query<D, UDoc>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startAt(...fieldValues: any[]): Query<D, UDoc>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startAt(...params: any[]): Query<D, UDoc> {
    return new Query<D, UDoc>(this.qImpl.startAt(...params));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startAfter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    snapshot: firebase.firestore.DocumentSnapshot<any>
  ): Query<D, UDoc>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startAfter(...fieldValues: any[]): Query<D, UDoc>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startAfter(...params: any[]): Query<D, UDoc> {
    return new Query<D, UDoc>(this.qImpl.startAfter(...params));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  endBefore(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    snapshot: firebase.firestore.DocumentSnapshot<any>
  ): Query<D, UDoc>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  endBefore(...fieldValues: any[]): Query<D, UDoc>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  endBefore(...params: any[]): Query<D, UDoc> {
    return new Query<D, UDoc>(this.qImpl.endBefore(...params));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  endAt(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    snapshot: firebase.firestore.DocumentSnapshot<any>
  ): Query<D, UDoc>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  endAt(...fieldValues: any[]): Query<D, UDoc>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  endAt(...params: any[]): Query<D, UDoc> {
    return new Query<D, UDoc>(this.qImpl.endAt(...params));
  }

  isEqual(other: Query<D, UDoc>): boolean {
    return this.qImpl.isEqual(other.qImpl);
  }

  onSnapshot(observer: {
    next?: (
      snapshot: firebase.firestore.QuerySnapshot<DocumentProps<D>>
    ) => void;
    error?: (error: Error) => void;
    complete?: () => void;
  }): () => void;
  onSnapshot(
    options: firebase.firestore.SnapshotListenOptions,
    observer: {
      next?: (
        snapshot: firebase.firestore.QuerySnapshot<DocumentProps<D>>
      ) => void;
      error?: (error: Error) => void;
      complete?: () => void;
    }
  ): () => void;
  onSnapshot(
    onNext: (
      snapshot: firebase.firestore.QuerySnapshot<DocumentProps<D>>
    ) => void,
    onError?: (error: Error) => void,
    onCompletion?: () => void
  ): () => void;
  onSnapshot(
    options: firebase.firestore.SnapshotListenOptions,
    onNext: (
      snapshot: firebase.firestore.QuerySnapshot<DocumentProps<D>>
    ) => void,
    onError?: (error: Error) => void,
    onCompletion?: () => void
  ): () => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSnapshot(param1: any, ...params: any[]): () => void {
    return this.qImpl.onSnapshot(param1, ...params);
  }

  fetchSnapshot(callback: (arrData: WithId<UDoc>[]) => void): void {
    let retArr: WithId<UDoc>[] = [];

    this.onSnapshot((snapshot) => {
      if (!snapshot.size) {
        retArr = [];
      } else {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'removed') {
            retArr = retArr.filter((data) => data._id !== change.doc.id);
          } else {
            const changeDoc = change.doc;
            const changeDocData = changeDoc.data();
            const decoded = this.decoder ? this.decoder(changeDocData) : {};

            retArr = retArr.filter((data) => data._id !== change.doc.id);
            retArr.push({
              _id: changeDoc.id,
              ...changeDocData,
              ...decoded,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);
          }
        });
      }
      callback(retArr);
    });
  }

  //Vは、Dのうち置換したい項目だけ書けばOK
  withConverter<V extends object>(
    decoder: Decoder<DocumentProps<D>, V>,
    encoder: Encoder<DocumentProps<D>, V>
  ): Query<D, Substitute<DocumentProps<D>, V>> {
    return new Query<D, Substitute<DocumentProps<D>, V>>(
      this.qImpl,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      decoder as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      encoder as any
    );
  }
}
