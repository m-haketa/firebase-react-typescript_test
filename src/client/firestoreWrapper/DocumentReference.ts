import * as firebase from 'firebase';

import { CollectionReference } from './CollectionReference';
import { DocumentProps, CollectionProps, WithId } from './type';

export class DocumentReference<D, U> {
  constructor(
    private dImpl: firebase.firestore.DocumentReference,
    private decoder?: (dbData: D) => Partial<U>,
    private encoder?: (userData: U) => Partial<D>
  ) {}

  get(
    options?: firebase.firestore.GetOptions
  ): Promise<firebase.firestore.DocumentSnapshot<DocumentProps<D>>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.dImpl.get(options) as any;
  }

  fetch(
    options?: firebase.firestore.GetOptions
  ): Promise<WithId<DocumentProps<U>> | undefined> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.dImpl.get(options).then((doc) => {
      const data = doc.data();
      if (data === undefined) return undefined;

      const decoded = this.decoder ? this.decoder(data as D) : data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { _id: doc.id, ...data, ...decoded } as any;
    });
  }

  collection(
    collectionPath: string & keyof CollectionProps<D> & keyof CollectionProps<U>
  ): CollectionReference<D[typeof collectionPath], U[typeof collectionPath]> {
    return new CollectionReference<
      D[typeof collectionPath],
      U[typeof collectionPath]
    >(this.dImpl.collection(collectionPath));
  }

  /*
  readonly id: string;
  readonly firestore: Firestore;
  readonly parent: CollectionReference<T>;
  readonly path: string;
  isEqual(other: DocumentReference<T>): boolean;
  set(data: T, options?: SetOptions): Promise<void>;
  update(data: UpdateData): Promise<void>;
  update(
    field: string | FieldPath,
    value: any,
    ...moreFieldsAndValues: any[]
  ): Promise<void>;
  delete(): Promise<void>;
  get(options?: GetOptions): Promise<DocumentSnapshot<T>>;
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
