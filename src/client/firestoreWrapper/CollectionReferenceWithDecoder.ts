import * as firebase from 'firebase';
import { fromFirestoreStab } from './utils';
import { CollectionReference } from './CollectionReference';

import type { Collection, DocumentProps, Encoder } from './type';
import { QueryWithDecoder } from './QueryWithDecoder';

export class CollectionReferenceWithDecoder<
  D extends Collection,
  DDec = DocumentProps<D>
> extends QueryWithDecoder<D, DDec> {
  constructor(
    private cImpl: firebase.firestore.CollectionReference,
    protected fromFirestore: (dbData: DocumentProps<D>) => DDec
  ) {
    super(cImpl, fromFirestore);
  }

  withEncoder(
    toFirestore: Encoder<DocumentProps<D>, DDec>
  ): CollectionReference<D, DDec> {
    return new CollectionReference<D, DDec>(
      this.cImpl.withConverter({
        fromFirestore: fromFirestoreStab(this.fromFirestore),
        toFirestore: toFirestore,
      })
    );
  }
}
