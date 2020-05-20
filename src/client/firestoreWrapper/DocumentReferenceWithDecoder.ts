import * as firebase from 'firebase';
import { fromFirestoreStab } from './utils';
import { DocumentReference } from './DocumentReference';

import type { Collection, DocumentProps, Encoder } from './type';

export class DocumentReferenceWithDecoder<
  D extends Collection,
  DDec = DocumentProps<D>
> {
  constructor(
    private dImpl: firebase.firestore.DocumentReference,
    protected fromFirestore: (dbData: DocumentProps<D>) => DDec
  ) {}

  withEncoder(
    toFirestore: Encoder<DocumentProps<D>, DDec>
  ): DocumentReference<D, DDec> {
    return new DocumentReference<D, DDec>(
      this.dImpl.withConverter({
        fromFirestore: fromFirestoreStab(this.fromFirestore),
        toFirestore: toFirestore,
      })
    );
  }
}
