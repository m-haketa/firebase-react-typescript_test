import * as firebase from 'firebase';

import { CollectionReference } from './CollectionReference';
import { DocumentReferenceWithDecoder } from './DocumentReferenceWithDecoder';

import {
  Document,
  SubCollections,
  Decoder,
  WithId,
  AddFieldValue,
} from './types';

export class DocumentReference<
  Doc extends Document,
  SubCols extends SubCollections = SubCollections,
  DDec extends Document = Doc
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

  set(
    data: AddFieldValue<DDec>,
    options?: firebase.firestore.SetOptions
  ): Promise<void> {
    return this.dImpl.set(data as DDec, options);
  }

  update(data: Partial<AddFieldValue<DDec>>): Promise<void> {
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

  withDecoder<V extends Document>(
    fromFirestore: Decoder<Doc, V>
  ): DocumentReferenceWithDecoder<Doc, SubCols, V> {
    return new DocumentReferenceWithDecoder<Doc, SubCols, V>(
      this.dImpl,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fromFirestore as any
    );
  }

  onSnapshot(observer: {
    next?: (snapshot: firebase.firestore.DocumentSnapshot<DDec>) => void;
    error?: (error: Error) => void;
    complete?: () => void;
  }): () => void;
  onSnapshot(
    options: firebase.firestore.SnapshotListenOptions,
    observer: {
      next?: (snapshot: firebase.firestore.DocumentSnapshot<DDec>) => void;
      error?: (error: Error) => void;
      complete?: () => void;
    }
  ): () => void;
  onSnapshot(
    onNext: (snapshot: firebase.firestore.DocumentSnapshot<DDec>) => void,
    onError?: (error: Error) => void,
    onCompletion?: () => void
  ): () => void;
  onSnapshot(
    options: firebase.firestore.SnapshotListenOptions,
    onNext: (snapshot: firebase.firestore.DocumentSnapshot<DDec>) => void,
    onError?: (error: Error) => void,
    onCompletion?: () => void
  ): () => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSnapshot(param1: any, ...params: any[]): () => void {
    return this.dImpl.onSnapshot(param1, ...params);
  }

  /*
  readonly parent: CollectionReference<T>;
  withConverter<U>(
    converter: FirestoreDataConverter<U>
  ): DocumentReference<U>;
  */
}
