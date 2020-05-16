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
  readonly id: string;
  readonly parent: DocumentReference<DocumentData> | null;
  readonly path: string;
  add(data: T): Promise<DocumentReference<T>>;
  isEqual(other: CollectionReference<T>): boolean;
  */
}
