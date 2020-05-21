import * as firebase from 'firebase';
import { fromFirestoreStab } from './utils';
import { CollectionReference } from './CollectionReference';

import type { Document, SubCollections, Encoder } from './types';
import { QueryWithDecoder } from './QueryWithDecoder';

export class CollectionReferenceWithDecoder<
  Doc extends Document,
  SubCols extends SubCollections,
  DDec = Doc
> extends QueryWithDecoder<Doc, SubCols, DDec> {
  constructor(
    private cImpl: firebase.firestore.CollectionReference,
    protected fromFirestore: (dbData: Doc) => DDec
  ) {
    super(cImpl, fromFirestore);
  }

  withEncoder(
    toFirestore: Encoder<Doc, DDec>
  ): CollectionReference<Doc, SubCols, DDec> {
    return new CollectionReference<Doc, SubCols, DDec>(
      this.cImpl.withConverter({
        fromFirestore: fromFirestoreStab(this.fromFirestore),
        toFirestore: toFirestore,
      })
    );
  }
}
