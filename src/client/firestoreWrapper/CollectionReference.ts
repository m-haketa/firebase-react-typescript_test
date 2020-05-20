import * as firebase from 'firebase';

import { Query } from './Query';
import { DocumentReference } from './DocumentReference';

import type { Collection, DocumentProps, Decoder, Encoder } from './type';

export class CollectionReference<
  D extends Collection,
  DDec = DocumentProps<D>,
  DEnc = DocumentProps<D>
> extends Query<D, DDec, DEnc> {
  constructor(
    private cImpl: firebase.firestore.CollectionReference,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fromFirestore: (dbData: DocumentProps<D>) => DDec = (d): DDec => d as any,
    toFirestore: (userData: DEnc) => DocumentProps<D> = (d): DocumentProps<D> =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      d as any
  ) {
    super(cImpl, fromFirestore, toFirestore);
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
      this.fromFirestore,
      this.toFirestore
    );
  }

  add(data: DEnc): Promise<DocumentReference<D, DDec, DEnc>> {
    const converted = this.toFirestore ? this.toFirestore(data) : data;
    return this.cImpl.add(converted).then((dImplRet) => {
      return new DocumentReference(
        dImplRet,
        this.fromFirestore,
        this.toFirestore
      );
    });
  }

  withDecoder<V extends object>(
    fromFirestore: Decoder<DocumentProps<D>, V>
  ): CollectionReference<D, V, DEnc> {
    return new CollectionReference<D, V, DEnc>(
      this.cImpl,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fromFirestore as any,
      this.toFirestore
    );
  }

  withEncoder<V extends object>(
    toFirestore: Encoder<DocumentProps<D>, V>
  ): CollectionReference<D, DDec, V> {
    return new CollectionReference<D, DDec, V>(
      this.cImpl,
      this.fromFirestore,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toFirestore as any
    );
  }

  /*
  readonly parent: DocumentReference<DocumentData> | null;
  withConverter<U>(
      converter: FirestoreDataConverter<U>
    ): CollectionReference<U>;
  */
}
