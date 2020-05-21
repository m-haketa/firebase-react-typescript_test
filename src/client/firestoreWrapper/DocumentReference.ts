import * as firebase from 'firebase';

import { CollectionReference } from './CollectionReference';
import { DocumentReferenceWithDecoder } from './DocumentReferenceWithDecoder';

import type { Document, SubCollections, Decoder, WithId } from './type';

export class DocumentReference<
  Doc extends Document,
  SubCols extends SubCollections,
  DDec = Doc
> {
  constructor(private dImpl: firebase.firestore.DocumentReference<DDec>) {}

  get firestore(): firebase.firestore.Firestore {
    return this.dImpl.firestore;
  }

  get id(): string {
    return this.dImpl.id;
  }

  get path(): string {
    return this.dImpl.path;
  }

  isEqual(other: DocumentReference<Doc, SubCols, DDec>): boolean {
    return this.dImpl.isEqual(other.dImpl);
  }

  get(
    options?: firebase.firestore.GetOptions
  ): Promise<firebase.firestore.DocumentSnapshot<DDec>> {
    return this.dImpl.get(options);
  }

  fetch(
    options?: firebase.firestore.GetOptions
  ): Promise<WithId<DDec> | undefined> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.dImpl.get(options).then((doc) => {
      const data = doc.data();
      if (data === undefined) return undefined;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { _id: doc.id, ...data } as any;
    });
  }

  collection<K extends keyof SubCols>(
    collectionPath: string & K
  ): CollectionReference<SubCols[K]['_documents'], SubCols[K]['_collections']> {
    return new CollectionReference<
      SubCols[K]['_documents'],
      SubCols[K]['_collections']
    >(this.dImpl.collection(collectionPath));
  }

  set(data: DDec, options?: firebase.firestore.SetOptions): Promise<void> {
    return this.dImpl.set(data, options);
  }

  update(data: DDec): Promise<void> {
    return this.dImpl.update(data);
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
    fromFirestore: Decoder<Doc, V>
  ): DocumentReferenceWithDecoder<Doc, SubCols, V> {
    return new DocumentReferenceWithDecoder<Doc, SubCols, V>(
      this.dImpl,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fromFirestore as any
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
