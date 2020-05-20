import * as firebase from 'firebase';

import { CollectionReference } from './CollectionReference';
import { fromFirestoreStab } from './utils';

import type {
  Collection,
  DocumentProps,
  Decoder,
  Encoder,
  WithId,
} from './type';

export class DocumentReference<
  D extends Collection,
  DDec = DocumentProps<D>,
  DEnc = DocumentProps<D>
> {
  constructor(
    private dImpl: firebase.firestore.DocumentReference,
    protected fromFirestore: (dbData: DocumentProps<D>) => DDec = (d): DDec =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      d as any,
    protected toFirestore: (userData: DEnc) => DocumentProps<D> = (
      d
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): DocumentProps<D> => d as any
  ) {}

  get firestore(): firebase.firestore.Firestore {
    return this.dImpl.firestore;
  }

  get id(): string {
    return this.dImpl.id;
  }

  get path(): string {
    return this.dImpl.path;
  }

  isEqual(other: DocumentReference<D, DDec, DEnc>): boolean {
    return this.dImpl.isEqual(other.dImpl);
  }

  get(
    options?: firebase.firestore.GetOptions
  ): Promise<firebase.firestore.DocumentSnapshot<DocumentProps<D>>> {
    console.log('decoder:' + this.fromFirestore);
    return (
      this.dImpl
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

  fetch(
    options?: firebase.firestore.GetOptions
  ): Promise<WithId<DDec> | undefined> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.dImpl
      .withConverter({
        fromFirestore: fromFirestoreStab(this.fromFirestore),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        toFirestore: this.toFirestore as any,
        /* fromとtoで型定義に矛盾が出る場合があるため使わないこちらはanyにする */
      })
      .get(options)
      .then((doc) => {
        const data = doc.data();
        if (data === undefined) return undefined;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { _id: doc.id, ...data } as any;
      });
  }

  collection<K extends keyof D['_collections']>(
    collectionPath: string & K
  ): CollectionReference<D['_collections'][K]> {
    return new CollectionReference<D['_collections'][K]>(
      this.dImpl.collection(collectionPath)
    );
  }

  set(data: DEnc, options?: firebase.firestore.SetOptions): Promise<void> {
    const converted = this.toFirestore
      ? { ...data, ...this.toFirestore(data) }
      : data;
    return this.dImpl.set(converted, options);
  }

  update(data: DEnc): Promise<void> {
    const converted = this.toFirestore
      ? { ...data, ...this.toFirestore(data) }
      : data;
    return this.dImpl.update(converted);
  }

  /* とりあえず、対応しない
  update(
    field: keyof DDec,
    value: any,
    ...moreFieldsAndValues: any[]
  ): Promise<void>;
  */

  delete(): Promise<void> {
    return this.dImpl.delete();
  }

  withDecoder<V extends object>(
    fromFirestore: Decoder<DocumentProps<D>, V>
  ): DocumentReference<D, V, V> {
    return new DocumentReference<D, V, V>(
      this.dImpl,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fromFirestore as any,
      this.toFirestore as any
    );
  }

  withEncoder(
    toFirestore: Encoder<DocumentProps<D>, DEnc>
  ): DocumentReference<D, DEnc, DEnc> {
    return new DocumentReference<D, DEnc, DEnc>(
      this.dImpl,
      this.fromFirestore as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toFirestore as any
    );
  }

  /*
  readonly parent: CollectionReference<T>;
  onSnapshot(observer: {
    next?: (snapshot: DocumentSnapshot<T>) => void;
    error?: (error: FirestoreError) => void;
    complete?: () => void;
  }): () => void;
  onSnapshot(
    options: SnapshotListenOptions,
    observer: {
      next?: (snapshot: DocumentSnapshot<T>) => void;
      error?: (error: Error) => void;
      complete?: () => void;
    }
  ): () => void;
  onSnapshot(
    onNext: (snapshot: DocumentSnapshot<T>) => void,
    onError?: (error: Error) => void,
    onCompletion?: () => void
  ): () => void;
  onSnapshot(
    options: SnapshotListenOptions,
    onNext: (snapshot: DocumentSnapshot<T>) => void,
    onError?: (error: Error) => void,
    onCompletion?: () => void
  ): () => void;

  withConverter<U>(
    converter: FirestoreDataConverter<U>
  ): DocumentReference<U>;
  */
}
