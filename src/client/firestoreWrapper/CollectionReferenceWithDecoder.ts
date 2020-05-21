import * as firebase from 'firebase';
import { fromFirestoreStab } from './utils';
import { CollectionReference } from './CollectionReference';

import type { Document, Collection, Encoder } from './type';
import { QueryWithDecoder } from './QueryWithDecoder';

export class CollectionReferenceWithDecoder<
  Doc extends Document,
  SubCol extends Collection,
  DDec = Doc
> extends QueryWithDecoder<Doc, SubCol, DDec> {
  constructor(
    private cImpl: firebase.firestore.CollectionReference,
    protected fromFirestore: (dbData: Doc) => DDec
  ) {
    super(cImpl, fromFirestore);
  }

  withEncoder(
    toFirestore: Encoder<Doc, DDec>
  ): CollectionReference<Doc, SubCol, DDec> {
    return new CollectionReference<Doc, SubCol, DDec>(
      this.cImpl.withConverter({
        fromFirestore: fromFirestoreStab(this.fromFirestore),
        toFirestore: toFirestore,
      })
    );
  }
}
