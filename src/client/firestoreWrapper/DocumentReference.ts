import * as firebase from 'firebase';

import { CollectionReference } from './CollectionReference';
import { Collection, DocumentProps, WithId } from './type';

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.dImpl.get(options) as any;
  }

  fetch(
    options?: firebase.firestore.GetOptions
  ): Promise<WithId<DDec> | undefined> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.dImpl.get(options).then((doc) => {
      const data = doc.data();
      if (data === undefined) return undefined;

      const decoded = this.fromFirestore
        ? this.fromFirestore(data as DocumentProps<D>)
        : data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { _id: doc.id, ...data, ...decoded } as any;
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
