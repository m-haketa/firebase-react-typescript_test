import * as firebase from 'firebase';

import { Query } from './Query';
import { DocumentReference } from './DocumentReference';

import type { Substitute, Decoder, Encoder } from './type';

export class CollectionReference<D, U> extends Query<D, U> {
  constructor(
    private cImpl: firebase.firestore.CollectionReference,
    decoder?: (dbData: D) => Partial<U>,
    encoder?: (userData: U) => Partial<D>
  ) {
    super(cImpl, decoder, encoder);
  }

  get id(): string {
    return this.cImpl.id;
  }

  get path(): string {
    return this.cImpl.path;
  }

  isEqual(other: CollectionReference<D, U>): boolean {
    return this.cImpl.isEqual(other.cImpl);
  }

  doc(documentPath?: string): DocumentReference<D, U> {
    return new DocumentReference<D, U>(this.cImpl.doc(documentPath));
  }

  //Vは、Dのうち置換したい項目だけ書けばOK
  withConverter<V extends object>(
    decoder: Decoder<D, V>,
    encoder: Encoder<D, V>
  ): CollectionReference<D, Substitute<D, V>> {
    return new CollectionReference<D, Substitute<D, V>>(
      this.cImpl,
      decoder,
      encoder
    );
  }

  /*
  readonly parent: DocumentReference<DocumentData> | null;
  add(data: T): Promise<DocumentReference<T>>;
  */
}
