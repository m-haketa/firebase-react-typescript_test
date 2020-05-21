import * as firebase from 'firebase';

import { Query } from './Query';
import { DocumentReference } from './DocumentReference';
import { CollectionReferenceWithDecoder } from './CollectionReferenceWithDecoder';

import type { Collection, DocumentProps, Decoder, Document } from './type';

export class CollectionReference<
  Doc extends Document,
  SubCol extends Collection,
  DDec = Doc
> extends Query<Doc, SubCol, DDec> {
  constructor(private cImpl: firebase.firestore.CollectionReference<DDec>) {
    super(cImpl);
  }

  get id(): string {
    return this.cImpl.id;
  }

  get path(): string {
    return this.cImpl.path;
  }

  isEqual(other: CollectionReference<Doc, SubCol, DDec>): boolean {
    return this.cImpl.isEqual(other.cImpl);
  }

  doc(documentPath?: string): DocumentReference<Doc, SubCol, DDec> {
    return new DocumentReference<Doc, SubCol, DDec>(
      this.cImpl.doc(documentPath)
    );
  }

  add(data: DDec): Promise<DocumentReference<Doc, SubCol, DDec>> {
    return this.cImpl.add(data).then((dImplRet) => {
      return new DocumentReference(dImplRet);
    });
  }

  withDecoder<V extends object>(
    fromFirestore: Decoder<Doc, V>
  ): CollectionReferenceWithDecoder<Doc, SubCol, V> {
    return new CollectionReferenceWithDecoder<Doc, SubCol, V>(
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
