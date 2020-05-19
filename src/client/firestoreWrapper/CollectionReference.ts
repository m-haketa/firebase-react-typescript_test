import * as firebase from 'firebase';

import { Query } from './Query';
import { DocumentReference } from './DocumentReference';

import type {
  Collection,
  DocumentProps,
  Substitute,
  Decoder,
  Encoder,
} from './type';

export class CollectionReference<
  D extends Collection,
  DDec = DocumentProps<D>,
  DEnc = DocumentProps<D>
> extends Query<D, DDec, DEnc> {
  constructor(
    private cImpl: firebase.firestore.CollectionReference,
    decoder?: (dbData: Partial<DocumentProps<D>>) => Partial<DDec>,
    encoder?: (userData: Partial<DEnc>) => Partial<DocumentProps<D>>
  ) {
    super(cImpl, decoder, encoder);
  }

  get id(): string {
    return this.cImpl.id;
  }

  get path(): string {
    return this.cImpl.path;
  }

  isEqual(other: CollectionReference<D, DDec, DEnc>): boolean {
    return this.cImpl.isEqual(other.cImpl);
  }

  doc(documentPath?: string): DocumentReference<D, DDec, DEnc> {
    return new DocumentReference<D, DDec, DEnc>(
      this.cImpl.doc(documentPath),
      this.decoder,
      this.encoder
    );
  }

  add(data: DDec): Promise<DocumentReference<D, DDec, DEnc>> {
    const converted = this.encoder ? { ...data, ...this.encoder(data) } : data;
    return this.cImpl.add(converted).then((dImplRet) => {
      return new DocumentReference(dImplRet, this.decoder, this.encoder);
    });
  }

  //Vは、Dのうち置換したい項目だけ書けばOK
  withConverter<V extends object>(
    decoder: Decoder<DocumentProps<D>, V>,
    encoder: Encoder<DocumentProps<D>, V>
  ): CollectionReference<
    D,
    Substitute<DocumentProps<D>, V>,
    Substitute<DocumentProps<D>, V>
  > {
    return new CollectionReference<
      D,
      Substitute<DocumentProps<D>, V>,
      Substitute<DocumentProps<D>, V>
    >(
      this.cImpl,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      decoder as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      encoder as any
    );
  }

  /*
  readonly parent: DocumentReference<DocumentData> | null;
  */
}
