import * as firebase from 'firebase';
import { fromFirestoreStab } from './utils';
import type {
  Collection,
  Decoder,
  DocumentProps,
  Encoder,
  Push,
  TupleStyle,
  WithId,
} from './type';

export class Query<
  D extends Collection,
  DDec = DocumentProps<D>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Order extends { [key: string]: any }[] = []
> {
  constructor(
    private qImpl: firebase.firestore.Query,
    protected fromFirestore: (dbData: DocumentProps<D>) => DDec = (d): DDec =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      d as any,
    protected toFirestore: (userData: DDec) => DocumentProps<D> = (
      d
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): DocumentProps<D> => d as any
  ) {}

  get firestore(): firebase.firestore.Firestore {
    return this.qImpl.firestore;
  }

  get(
    options?: firebase.firestore.GetOptions
  ): Promise<firebase.firestore.QuerySnapshot<DocumentProps<D>>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (
      this.qImpl
        .withConverter({
          fromFirestore: fromFirestoreStab(this.fromFirestore),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          toFirestore: this.toFirestore as any,
          /* fromとtoで型定義に矛盾が出る場合があるため使わないこちらはanyにする */
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .get(options) as any
    );
  }

  fetch(options?: firebase.firestore.GetOptions): Promise<WithId<DDec>[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.get(options).then((get) => {
      if (get.docs === undefined) return [];
      return get.docs.map((doc) => {
        const data = doc.data();
        return { ...data, _id: doc.id };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any;
    });
  }

  where<K extends keyof DocumentProps<D>>(
    fieldPath: (K & string) | firebase.firestore.FieldPath,
    opStr: firebase.firestore.WhereFilterOp,
    value: DocumentProps<D>[K]
  ): Query<D, DDec, Order> {
    return new Query<D, DDec, Order>(this.qImpl.where(fieldPath, opStr, value));
  }

  orderBy<K extends keyof DDec>(
    fieldPath: (K & string) | firebase.firestore.FieldPath,
    directionStr?: firebase.firestore.OrderByDirection
  ): Query<D, DDec, Push<Order, Pick<DDec, K>>> {
    return new Query<D, DDec, Push<Order, Pick<DDec, K>>>(
      this.qImpl.orderBy(fieldPath, directionStr)
    );
  }

  limit(limit: number): Query<D, DDec, Order> {
    return new Query<D, DDec, Order>(this.qImpl.limit(limit));
  }

  limitToLast(limit: number): Query<D, DDec, Order> {
    return new Query<D, DDec, Order>(this.qImpl.limitToLast(limit));
  }

  startAt(
    snapshot: firebase.firestore.DocumentSnapshot<unknown>
  ): Query<D, DDec, Order>;
  startAt(...params: TupleStyle<Order>): Query<D, DDec, Order>;
  startAt(...params: unknown[]): Query<D, DDec, Order> {
    //if (params[0] instanceof firebase.firestore.DocumentSnapshot) {
    //  //snapshotオブジェクトの場合
    //  return new Query<D, DDec, Order>(this.qImpl.startAt(...params));
    //}
    //TODO:withConverter使用に伴う引数置換のロジックを入れるならここだが難しすぎるため見送り
    return new Query<D, DDec, Order>(this.qImpl.startAt(...params));
  }

  startAfter(
    snapshot: firebase.firestore.DocumentSnapshot<unknown>
  ): Query<D, DDec, Order>;
  startAfter(...params: TupleStyle<Order>): Query<D, DDec, Order>;
  startAfter(...params: unknown[]): Query<D, DDec, Order> {
    return new Query<D, DDec, Order>(this.qImpl.startAfter(...params));
  }

  endBefore(
    snapshot: firebase.firestore.DocumentSnapshot<unknown>
  ): Query<D, DDec, Order>;
  endBefore(...params: TupleStyle<Order>): Query<D, DDec, Order>;
  endBefore(...params: unknown[]): Query<D, DDec, Order> {
    return new Query<D, DDec, Order>(this.qImpl.endBefore(...params));
  }

  endAt(
    snapshot: firebase.firestore.DocumentSnapshot<unknown>
  ): Query<D, DDec, Order>;
  endAt(...params: TupleStyle<Order>): Query<D, DDec, Order>;
  endAt(...params: unknown[]): Query<D, DDec, Order> {
    return new Query<D, DDec, Order>(this.qImpl.endAt(...params));
  }

  isEqual(other: Query<D, DDec, Order>): boolean {
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
    fromFirestore: Decoder<DocumentProps<D>, V>
  ): Query<D, V, Order> {
    return new Query<D, V, Order>(
      this.qImpl,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fromFirestore as any,
      this.toFirestore as any
    );
  }

  withEncoder(
    toFirestore: Encoder<DocumentProps<D>, DDec>
  ): Query<D, DDec, Order> {
    return new Query<D, DDec, Order>(
      this.qImpl,
      this.fromFirestore as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toFirestore as any
    );
  }

  //withConverter<U>(converter: FirestoreDataConverter<U>): Query<U>;
}
