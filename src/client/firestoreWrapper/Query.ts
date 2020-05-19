import * as firebase from 'firebase';

import type {
  Collection,
  DocumentProps,
  WithId,
  Substitute,
  Decoder,
  Encoder,
  Push,
  TupleStyle,
} from './type';

export class Query<
  D extends Collection,
  UDoc = DocumentProps<D>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Order extends { [key: string]: any }[] = []
> {
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

  where<K extends keyof DocumentProps<D>>(
    fieldPath: (K & string) | firebase.firestore.FieldPath,
    opStr: firebase.firestore.WhereFilterOp,
    value: DocumentProps<D>[K]
  ): Query<D, UDoc, Order> {
    return new Query<D, UDoc, Order>(this.qImpl.where(fieldPath, opStr, value));
  }

  orderBy<K extends keyof UDoc>(
    fieldPath: (K & string) | firebase.firestore.FieldPath,
    directionStr?: firebase.firestore.OrderByDirection
  ): Query<D, UDoc, Push<Order, Pick<UDoc, K>>> {
    return new Query<D, UDoc, Push<Order, Pick<UDoc, K>>>(
      this.qImpl.orderBy(fieldPath, directionStr)
    );
  }

  limit(limit: number): Query<D, UDoc, Order> {
    return new Query<D, UDoc, Order>(this.qImpl.limit(limit));
  }

  limitToLast(limit: number): Query<D, UDoc, Order> {
    return new Query<D, UDoc, Order>(this.qImpl.limitToLast(limit));
  }

  startAt(
    snapshot: firebase.firestore.DocumentSnapshot<unknown>
  ): Query<D, UDoc, Order>;
  startAt(...params: TupleStyle<Order>): Query<D, UDoc, Order>;
  startAt(...params: unknown[]): Query<D, UDoc, Order> {
    //if (params[0] instanceof firebase.firestore.DocumentSnapshot) {
    //  //snapshotオブジェクトの場合
    //  return new Query<D, UDoc, Order>(this.qImpl.startAt(...params));
    //}
    //TODO:withConverter使用に伴う引数置換のロジックを入れるならここだが難しすぎるため見送り
    return new Query<D, UDoc, Order>(this.qImpl.startAt(...params));
  }

  startAfter(
    snapshot: firebase.firestore.DocumentSnapshot<unknown>
  ): Query<D, UDoc, Order>;
  startAfter(...params: TupleStyle<Order>): Query<D, UDoc, Order>;
  startAfter(...params: unknown[]): Query<D, UDoc, Order> {
    return new Query<D, UDoc, Order>(this.qImpl.startAfter(...params));
  }

  endBefore(
    snapshot: firebase.firestore.DocumentSnapshot<unknown>
  ): Query<D, UDoc, Order>;
  endBefore(...params: TupleStyle<Order>): Query<D, UDoc, Order>;
  endBefore(...params: unknown[]): Query<D, UDoc, Order> {
    return new Query<D, UDoc, Order>(this.qImpl.endBefore(...params));
  }

  endAt(
    snapshot: firebase.firestore.DocumentSnapshot<unknown>
  ): Query<D, UDoc, Order>;
  endAt(...params: TupleStyle<Order>): Query<D, UDoc, Order>;
  endAt(...params: unknown[]): Query<D, UDoc, Order> {
    return new Query<D, UDoc, Order>(this.qImpl.endAt(...params));
  }

  isEqual(other: Query<D, UDoc, Order>): boolean {
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

  fetchSnapshot(callback: (arrData: WithId<UDoc>[]) => void): () => void {
    let retArr: WithId<UDoc>[] = [];

    return this.onSnapshot((snapshot) => {
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
  //TODO: Query<D, Substitute<DocumentProps<D>, V>, Order>の
  //OrderをSubstituteObjArr<Order, V>に修正して、
  //OrderBy指定後のStartAtなどを変換後のパラメータで指定
  //できるようにしたかったが、あまりに複雑なため、とりあえず見送り
  withConverter<V extends object>(
    decoder: Decoder<DocumentProps<D>, V>,
    encoder: Encoder<DocumentProps<D>, V>
  ): Query<D, Substitute<DocumentProps<D>, V>, Order> {
    return new Query<D, Substitute<DocumentProps<D>, V>, Order>(
      this.qImpl,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      decoder as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      encoder as any
    );
  }
}
