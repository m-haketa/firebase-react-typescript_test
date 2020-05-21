import * as firebase from 'firebase';
import { fromFirestoreStab } from './utils';
import { DocumentReference } from './DocumentReference';

import type { Document, SubCollections, Encoder } from './types';

export class DocumentReferenceWithDecoder<
  Doc extends Document,
  SubCols extends SubCollections,
  DDec = Doc
> {
  constructor(
    private dImpl: firebase.firestore.DocumentReference,
    protected fromFirestore: (dbData: Doc) => DDec
  ) {}

  withEncoder(
    toFirestore: Encoder<Doc, DDec>
  ): DocumentReference<Doc, SubCols, DDec> {
    return new DocumentReference<Doc, SubCols, DDec>(
      this.dImpl.withConverter({
        fromFirestore: fromFirestoreStab(this.fromFirestore),
        toFirestore: toFirestore,
      })
    );
  }
}
