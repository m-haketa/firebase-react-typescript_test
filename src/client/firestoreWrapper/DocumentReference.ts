import * as firebase from 'firebase';

import { CollectionReference } from './CollectionReference';
import { DocumentProps, CollectionProps, WithId } from './type';

export class DocumentReference<D, U> {
  constructor(
    private dImpl: firebase.firestore.DocumentReference,
    private decoder?: (
      dbData: Partial<DocumentProps<D>>
    ) => Partial<DocumentProps<U>>,
    private encoder?: (
      userData: Partial<DocumentProps<U>>
    ) => Partial<DocumentProps<D>>
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

  isEqual(other: DocumentReference<D, U>): boolean {
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

  set(
    data: DocumentProps<U>,
    options?: firebase.firestore.SetOptions
  ): Promise<void> {
    const converted = this.encoder ? { ...data, ...this.encoder(data) } : data;
    return this.dImpl.set(converted, options);
  }

  update(data: Partial<DocumentProps<U>>): Promise<void> {
    const converted = this.encoder ? { ...data, ...this.encoder(data) } : data;
    return this.dImpl.update(converted);
  }

  /* とりあえず、対応しない
  update(
    field: keyof DocumentProps<U>,
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
