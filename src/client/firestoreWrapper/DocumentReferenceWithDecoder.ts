import * as firebase from 'firebase';
import { fromFirestoreStab } from './utils';
import { DocumentReference } from './DocumentReference';

import type { Document, Collection, Encoder } from './type';

export class DocumentReferenceWithDecoder<
  Doc extends Document,
  SubCol extends Collection,
  DDec = Doc
> {
  constructor(
    private dImpl: firebase.firestore.DocumentReference,
    protected fromFirestore: (dbData: Doc) => DDec
  ) {}

  withEncoder(
    toFirestore: Encoder<Doc, DDec>
  ): DocumentReference<Doc, SubCol, DDec> {
    return new DocumentReference<Doc, SubCol, DDec>(
      this.dImpl.withConverter({
        fromFirestore: fromFirestoreStab(this.fromFirestore),
        toFirestore: toFirestore,
      })
    );
  }
}
