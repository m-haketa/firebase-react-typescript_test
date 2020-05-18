import * as firebase from 'firebase';

import type {
  Collection,
  DocumentProps,
  CollectionProps,
  WithId,
  Substitute,
  Decoder,
  Encoder,
} from './type';

export class Query<
  D extends Collection,
  UDoc = DocumentProps<D>,
  DDoc = DocumentProps<D>,
  DCol = CollectionProps<D>
> {
  constructor(
    private qImpl: firebase.firestore.Query,
    protected decoder?: (dbData: Partial<DDoc>) => Partial<UDoc>,
    protected encoder?: (userData: Partial<UDoc>) => Partial<DDoc>
  ) {}

  get firestore(): firebase.firestore.Firestore {
    return this.qImpl.firestore;
  }

  get(
    options?: firebase.firestore.GetOptions
  ): Promise<firebase.firestore.QuerySnapshot<DDoc>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.qImpl.get(options) as any;
  }

  fetch(options?: firebase.firestore.GetOptions): Promise<WithId<UDoc>[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.qImpl.get(options).then((get) => {
      if (get.docs === undefined) return [];
      return get.docs.map((doc) => {
        const data = doc.data();
        const decoded = this.decoder ? this.decoder(data as DDoc) : data;
        return { _id: doc.id, ...data, ...decoded };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any;
    });
  }

  where<T extends keyof DDoc>(
    fieldPath: (T & string) | firebase.firestore.FieldPath,
    opStr: firebase.firestore.WhereFilterOp,
    value: DDoc[T]
  ): Query<D, UDoc, DDoc, DCol> {
    return new Query<D, UDoc, DDoc, DCol>(
      this.qImpl.where(fieldPath, opStr, value)
    );
  }

  orderBy(
    fieldPath: string | firebase.firestore.FieldPath,
    directionStr?: firebase.firestore.OrderByDirection
  ): Query<D, UDoc, DDoc, DCol> {
    return new Query<D, UDoc, DDoc, DCol>(
      this.qImpl.orderBy(fieldPath, directionStr)
    );
  }

  limit(limit: number): Query<D, UDoc, DDoc, DCol> {
    return new Query<D, UDoc, DDoc, DCol>(this.qImpl.limit(limit));
  }

  limitToLast(limit: number): Query<D, UDoc, DDoc, DCol> {
    return new Query<D, UDoc, DDoc, DCol>(this.qImpl.limitToLast(limit));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startAt(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    snapshot: firebase.firestore.DocumentSnapshot<any>
  ): Query<D, UDoc, DDoc, DCol>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startAt(...fieldValues: any[]): Query<D, UDoc, DDoc, DCol>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startAt(...params: any[]): Query<D, UDoc, DDoc, DCol> {
    return new Query<D, UDoc, DDoc, DCol>(this.qImpl.startAt(...params));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startAfter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    snapshot: firebase.firestore.DocumentSnapshot<any>
  ): Query<D, UDoc, DDoc, DCol>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startAfter(...fieldValues: any[]): Query<D, UDoc, DDoc, DCol>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startAfter(...params: any[]): Query<D, UDoc, DDoc, DCol> {
    return new Query<D, UDoc, DDoc, DCol>(this.qImpl.startAfter(...params));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  endBefore(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    snapshot: firebase.firestore.DocumentSnapshot<any>
  ): Query<D, UDoc, DDoc, DCol>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  endBefore(...fieldValues: any[]): Query<D, UDoc, DDoc, DCol>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  endBefore(...params: any[]): Query<D, UDoc, DDoc, DCol> {
    return new Query<D, UDoc, DDoc, DCol>(this.qImpl.endBefore(...params));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  endAt(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    snapshot: firebase.firestore.DocumentSnapshot<any>
  ): Query<D, UDoc, DDoc, DCol>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  endAt(...fieldValues: any[]): Query<D, UDoc, DDoc, DCol>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  endAt(...params: any[]): Query<D, UDoc, DDoc, DCol> {
    return new Query<D, UDoc, DDoc, DCol>(this.qImpl.endAt(...params));
  }

  isEqual(other: Query<D, UDoc, DDoc, DCol>): boolean {
    return this.qImpl.isEqual(other.qImpl);
  }

  onSnapshot(observer: {
    next?: (snapshot: firebase.firestore.QuerySnapshot<DDoc>) => void;
    error?: (error: Error) => void;
    complete?: () => void;
  }): () => void;
  onSnapshot(
    options: firebase.firestore.SnapshotListenOptions,
    observer: {
      next?: (snapshot: firebase.firestore.QuerySnapshot<DDoc>) => void;
      error?: (error: Error) => void;
      complete?: () => void;
    }
  ): () => void;
  onSnapshot(
    onNext: (snapshot: firebase.firestore.QuerySnapshot<DDoc>) => void,
    onError?: (error: Error) => void,
    onCompletion?: () => void
  ): () => void;
  onSnapshot(
    options: firebase.firestore.SnapshotListenOptions,
    onNext: (snapshot: firebase.firestore.QuerySnapshot<DDoc>) => void,
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
    decoder: Decoder<DDoc, V>,
    encoder: Encoder<DDoc, V>
  ): Query<D, Substitute<DDoc, V>> {
    return new Query<D, Substitute<DDoc, V>>(
      this.qImpl,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      decoder as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      encoder as any
    );
  }
}
