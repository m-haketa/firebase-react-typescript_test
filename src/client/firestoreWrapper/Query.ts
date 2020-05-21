import * as firebase from 'firebase';
import { QueryWithDecoder } from './QueryWithDecoder';

import type {
  Document,
  SubCollections,
  Decoder,
  Push,
  TupleStyle,
  WithId,
} from './type';

export class Query<
  Doc extends Document,
  SubCols extends SubCollections = SubCollections,
  DDec = Doc,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Order extends { [key: string]: any }[] = []
> {
  constructor(private qImpl: firebase.firestore.Query<DDec>) {}

  get firestore(): firebase.firestore.Firestore {
    return this.qImpl.firestore;
  }

  get(
    options?: firebase.firestore.GetOptions
  ): Promise<firebase.firestore.QuerySnapshot<DDec>> {
    return this.qImpl.get(options);
  }

  fetch(options?: firebase.firestore.GetOptions): Promise<WithId<DDec>[]> {
    return this.get(options).then((get) => {
      if (get.docs === undefined) return [];
      return get.docs.map((doc) => {
        const data = doc.data();
        return { ...data, _id: doc.id };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any;
    });
  }

  where<K extends keyof Doc>(
    fieldPath: (K & string) | firebase.firestore.FieldPath,
    opStr: firebase.firestore.WhereFilterOp,
    value: Doc[K]
  ): Query<Doc, SubCols, DDec, Order> {
    return new Query<Doc, SubCols, DDec, Order>(
      this.qImpl.where(fieldPath, opStr, value)
    );
  }

  orderBy<K extends keyof DDec>(
    fieldPath: (K & string) | firebase.firestore.FieldPath,
    directionStr?: firebase.firestore.OrderByDirection
  ): Query<Doc, SubCols, DDec, Push<Order, Pick<DDec, K>>> {
    return new Query<Doc, SubCols, DDec, Push<Order, Pick<DDec, K>>>(
      this.qImpl.orderBy(fieldPath, directionStr)
    );
  }

  limit(limit: number): Query<Doc, SubCols, DDec, Order> {
    return new Query<Doc, SubCols, DDec, Order>(this.qImpl.limit(limit));
  }

  limitToLast(limit: number): Query<Doc, SubCols, DDec, Order> {
    return new Query<Doc, SubCols, DDec, Order>(this.qImpl.limitToLast(limit));
  }

  startAt(
    snapshot: firebase.firestore.DocumentSnapshot<unknown>
  ): Query<Doc, SubCols, DDec, Order>;
  startAt(...params: TupleStyle<Order>): Query<Doc, SubCols, DDec, Order>;
  startAt(...params: unknown[]): Query<Doc, SubCols, DDec, Order> {
    //if (params[0] instanceof firebase.firestore.DocumentSnapshot) {
    //  //snapshotオブジェクトの場合
    //  return new Query<Doc, SubCols, DDec, Order>(this.qImpl.startAt(...params));
    //}
    //TODO:withConverter使用に伴う引数置換のロジックを入れるならここだが難しすぎるため見送り
    return new Query<Doc, SubCols, DDec, Order>(this.qImpl.startAt(...params));
  }

  startAfter(
    snapshot: firebase.firestore.DocumentSnapshot<unknown>
  ): Query<Doc, SubCols, DDec, Order>;
  startAfter(...params: TupleStyle<Order>): Query<Doc, SubCols, DDec, Order>;
  startAfter(...params: unknown[]): Query<Doc, SubCols, DDec, Order> {
    return new Query<Doc, SubCols, DDec, Order>(
      this.qImpl.startAfter(...params)
    );
  }

  endBefore(
    snapshot: firebase.firestore.DocumentSnapshot<unknown>
  ): Query<Doc, SubCols, DDec, Order>;
  endBefore(...params: TupleStyle<Order>): Query<Doc, SubCols, DDec, Order>;
  endBefore(...params: unknown[]): Query<Doc, SubCols, DDec, Order> {
    return new Query<Doc, SubCols, DDec, Order>(
      this.qImpl.endBefore(...params)
    );
  }

  endAt(
    snapshot: firebase.firestore.DocumentSnapshot<unknown>
  ): Query<Doc, SubCols, DDec, Order>;
  endAt(...params: TupleStyle<Order>): Query<Doc, SubCols, DDec, Order>;
  endAt(...params: unknown[]): Query<Doc, SubCols, DDec, Order> {
    return new Query<Doc, SubCols, DDec, Order>(this.qImpl.endAt(...params));
  }

  isEqual(other: Query<Doc, SubCols, DDec, Order>): boolean {
    return this.qImpl.isEqual(other.qImpl);
  }

  onSnapshot(observer: {
    next?: (snapshot: firebase.firestore.QuerySnapshot<Doc>) => void;
    error?: (error: Error) => void;
    complete?: () => void;
  }): () => void;
  onSnapshot(
    options: firebase.firestore.SnapshotListenOptions,
    observer: {
      next?: (snapshot: firebase.firestore.QuerySnapshot<Doc>) => void;
      error?: (error: Error) => void;
      complete?: () => void;
    }
  ): () => void;
  onSnapshot(
    onNext: (snapshot: firebase.firestore.QuerySnapshot<Doc>) => void,
    onError?: (error: Error) => void,
    onCompletion?: () => void
  ): () => void;
  onSnapshot(
    options: firebase.firestore.SnapshotListenOptions,
    onNext: (snapshot: firebase.firestore.QuerySnapshot<Doc>) => void,
    onError?: (error: Error) => void,
    onCompletion?: () => void
  ): () => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSnapshot(param1: any, ...params: any[]): () => void {
    return this.qImpl.onSnapshot(param1, ...params);
  }

  fetchSnapshot(callback: (arrData: WithId<DDec>[]) => void): () => void {
    let retArr: WithId<DDec>[] = [];

    return this.onSnapshot((snapshot) => {
      retArr = [];
      snapshot.forEach((doc) => {
        const docData = doc.data();

        retArr.push({
          _id: doc.id,
          ...docData,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
      });
      callback(retArr);
    });
  }

  withDecoder<V extends object>(
    fromFirestore: Decoder<Doc, V>
  ): QueryWithDecoder<Doc, SubCols, V, Order> {
    return new QueryWithDecoder<Doc, SubCols, V, Order>(
      this.qImpl,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fromFirestore as any
    );
  }

  //withConverter<U>(converter: FirestoreDataConverter<U>): Query<U>;
}
