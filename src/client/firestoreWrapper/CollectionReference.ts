import * as firebase from 'firebase';

import { Query } from './Query';
import { DocumentReference } from './DocumentReference';
import { CollectionReferenceWithDecoder } from './CollectionReferenceWithDecoder';

import type { SubCollections, Decoder, Document } from './type';

export class CollectionReference<
  Doc extends Document,
  SubCols extends SubCollections = SubCollections,
  DDec = Doc
> extends Query<Doc, SubCols, DDec> {
  constructor(private cImpl: firebase.firestore.CollectionReference<DDec>) {
    super(cImpl);
  }

  get id(): string {
    return this.cImpl.id;
  }

  get path(): string {
    return this.cImpl.path;
  }

  isEqual(other: CollectionReference<Doc, SubCols, DDec>): boolean {
    return this.cImpl.isEqual(other.cImpl);
  }

  doc(documentPath?: string): DocumentReference<Doc, SubCols, DDec> {
    return new DocumentReference<Doc, SubCols, DDec>(
      this.cImpl.doc(documentPath)
    );
  }

  add(data: DDec): Promise<DocumentReference<Doc, SubCols, DDec>> {
    return this.cImpl.add(data).then((dImplRet) => {
      return new DocumentReference(dImplRet);
    });
  }

  withDecoder<V extends object>(
    fromFirestore: Decoder<Doc, V>
  ): CollectionReferenceWithDecoder<Doc, SubCols, V> {
    return new CollectionReferenceWithDecoder<Doc, SubCols, V>(
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
