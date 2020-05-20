import * as firebase from 'firebase';

import { Query } from './Query';
import { DocumentReference } from './DocumentReference';
import { CollectionReferenceWithDecoder } from './CollectionReferenceWithDecoder';

import type { Collection, DocumentProps, Decoder } from './type';

export class CollectionReference<
  D extends Collection,
  DDec = DocumentProps<D>
> extends Query<D, DDec> {
  constructor(private cImpl: firebase.firestore.CollectionReference) {
    super(cImpl);
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
    return new DocumentReference<D, DDec>(this.cImpl.doc(documentPath));
  }

  add(data: DDec): Promise<DocumentReference<D, DDec>> {
    return this.cImpl.add(data).then((dImplRet) => {
      return new DocumentReference(dImplRet);
    });
  }

  withDecoder<V extends object>(
    fromFirestore: Decoder<DocumentProps<D>, V>
  ): CollectionReferenceWithDecoder<D, V> {
    return new CollectionReferenceWithDecoder<D, V>(
      this.cImpl,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fromFirestore as any
    );
  }

  /*
  readonly parent: DocumentReference<DocumentData> | null;
  withConverter<U>(
      converter: FirestoreDataConverter<U>
    ): CollectionReference<U>;
  */
}
