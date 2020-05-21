import * as firebase from 'firebase';

import { Query } from './Query';
import { DocumentReference } from './DocumentReference';
import { CollectionReferenceWithDecoder } from './CollectionReferenceWithDecoder';

import type { AddFieldValue, SubCollections, Decoder, Document } from './types';

export class CollectionReference<
  Doc extends Document,
  SubCols extends SubCollections = SubCollections,
  DDec extends Document = Doc
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

  add(
    data: AddFieldValue<DDec>
  ): Promise<DocumentReference<Doc, SubCols, DDec>> {
    return this.cImpl.add(data as DDec).then((dImplRet) => {
      return new DocumentReference(dImplRet);
    });
  }

  withDecoder<V extends Document>(
    fromFirestore: Decoder<Doc, V>
  ): CollectionReferenceWithDecoder<Doc, SubCols, V> {
    return new CollectionReferenceWithDecoder<Doc, SubCols, V>(
      this.cImpl,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fromFirestore as any
    );
  }

  //withDecoder、withEncoder後に、setDocumentTypeを使うと、
  //型が壊れる可能性があるがとりあえずは無視
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setDocumentType<V extends Document>(dummy?: V): CollectionReference<V> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new CollectionReference<V>(this.cImpl as any);
  }
  /*
  readonly parent: DocumentReference<DocumentData> | null;
  withConverter<U>(
      converter: FirestoreDataConverter<U>
    ): CollectionReference<U>;
  */
}
