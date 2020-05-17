import * as firebase from 'firebase';

import { Query } from './Query';
import { DocumentReference } from './DocumentReference';

import type {
  Collection,
  DocumentProps,
  CollectionProps,
  Substitute,
  Decoder,
  Encoder,
} from './type';

export class CollectionReference<
  D extends Collection,
  UDoc = DocumentProps<D>,
  DDoc = DocumentProps<D>,
  DCol = CollectionProps<D>
> extends Query<D, UDoc, DDoc, DCol> {
  constructor(
    private cImpl: firebase.firestore.CollectionReference,
    decoder?: (dbData: Partial<DDoc>) => Partial<UDoc>,
    encoder?: (userData: Partial<UDoc>) => Partial<DDoc>
  ) {
    super(cImpl, decoder, encoder);
  }

  get id(): string {
    return this.cImpl.id;
  }

  get path(): string {
    return this.cImpl.path;
  }

  isEqual(other: CollectionReference<D, UDoc, DDoc, DCol>): boolean {
    return this.cImpl.isEqual(other.cImpl);
  }

  doc(documentPath?: string): DocumentReference<D, UDoc, DDoc, DCol> {
    return new DocumentReference<D, UDoc, DDoc, DCol>(
      this.cImpl.doc(documentPath),
      this.decoder,
      this.encoder
    );
  }

  add(data: UDoc): Promise<DocumentReference<D, UDoc, DDoc, DCol>> {
    const converted = this.encoder ? { ...data, ...this.encoder(data) } : data;
    return this.cImpl.add(converted).then((dImplRet) => {
      return new DocumentReference(dImplRet, this.decoder, this.encoder);
    });
  }

  //Vは、Dのうち置換したい項目だけ書けばOK
  withConverter<V extends object>(
    decoder: Decoder<DDoc, V>,
    encoder: Encoder<DDoc, V>
  ): CollectionReference<D, Substitute<DDoc, V>> {
    return new CollectionReference<D, Substitute<DDoc, V>>(
      this.cImpl,
      decoder as any,
      encoder as any
    );
  }

  /*
  readonly parent: DocumentReference<DocumentData> | null;
  */
}
