import * as firebase from 'firebase';

import { Query } from './Query';
import { DocumentReference } from './DocumentReference';

import type { DocumentProps, Substitute, Decoder, Encoder } from './type';

export class CollectionReference<D, U> extends Query<D, U> {
  constructor(
    private cImpl: firebase.firestore.CollectionReference,
    decoder?: (dbData: Partial<DocumentProps<D>>) => Partial<DocumentProps<U>>,
    encoder?: (userData: Partial<DocumentProps<U>>) => Partial<DocumentProps<D>>
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
    return new DocumentReference<D, U>(
      this.cImpl.doc(documentPath),
      this.decoder,
      this.encoder
    );
  }

  add(data: DocumentProps<U>): Promise<DocumentReference<D, U>> {
    const converted = this.encoder ? { ...data, ...this.encoder(data) } : data;
    return this.cImpl.add(converted).then((dImplRet) => {
      return new DocumentReference(dImplRet, this.decoder, this.encoder);
    });
  }

  //Vは、Dのうち置換したい項目だけ書けばOK
  withConverter<V extends object>(
    decoder: Decoder<DocumentProps<D>, V>,
    encoder: Encoder<DocumentProps<D>, V>
  ): CollectionReference<D, Substitute<D, V>> {
    return new CollectionReference<D, Substitute<D, V>>(
      this.cImpl,
      decoder as any,
      encoder as any
    );
  }

  /*
  readonly parent: DocumentReference<DocumentData> | null;
  */
}
