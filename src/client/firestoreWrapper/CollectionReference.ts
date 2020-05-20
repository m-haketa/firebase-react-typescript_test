import * as firebase from 'firebase';

import { Query } from './Query';
import { DocumentReference } from './DocumentReference';
import { fromFirestoreStab } from './utils';

import type { Collection, DocumentProps, Decoder, Encoder } from './type';

export class CollectionReference<
  D extends Collection,
  DDec = DocumentProps<D>
> extends Query<D, DDec> {
  constructor(
    private cImpl: firebase.firestore.CollectionReference,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fromFirestore: (dbData: DocumentProps<D>) => DDec = (d): DDec => d as any,
    toFirestore: (userData: DDec) => DocumentProps<D> = (d): DocumentProps<D> =>
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

  isEqual(other: CollectionReference<D, DDec>): boolean {
    return this.cImpl.isEqual(other.cImpl);
  }

  doc(documentPath?: string): DocumentReference<D, DDec> {
    return new DocumentReference<D, DDec>(
      this.cImpl.doc(documentPath),
      this.fromFirestore,
      this.toFirestore
    );
  }

  add(data: DDec): Promise<DocumentReference<D, DDec>> {
    return this.cImpl
      .withConverter({
        /* fromとtoで型定義に矛盾が出る場合があるため使わないこちらはanyにする */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fromFirestore: fromFirestoreStab(this.fromFirestore) as any,
        toFirestore: this.toFirestore,
      })
      .add(data)
      .then((dImplRet) => {
        return new DocumentReference(
          dImplRet,
          this.fromFirestore,
          this.toFirestore
        );
      });
  }

  withDecoder<V extends object>(
    fromFirestore: Decoder<DocumentProps<D>, V>
  ): CollectionReference<D, V> {
    return new CollectionReference<D, V>(
      this.cImpl,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fromFirestore as any,
      this.toFirestore as any
    );
  }

  withEncoder(
    toFirestore: Encoder<DocumentProps<D>, DDec>
  ): CollectionReference<D, DDec> {
    return new CollectionReference<D, DDec>(
      this.cImpl,
      this.fromFirestore as any,
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
