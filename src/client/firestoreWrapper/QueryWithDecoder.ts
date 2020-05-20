import * as firebase from 'firebase';
import { fromFirestoreStab } from './utils';
import { Query } from './Query';

import type { Collection, DocumentProps, Encoder } from './type';

export class QueryWithDecoder<
  D extends Collection,
  DDec = DocumentProps<D>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Order extends { [key: string]: any }[] = []
> {
  constructor(
    private qImpl: firebase.firestore.Query,
    protected fromFirestore: (dbData: DocumentProps<D>) => DDec
  ) {}

  withEncoder(
    toFirestore: Encoder<DocumentProps<D>, DDec>
  ): Query<D, DDec, Order> {
    return new Query<D, DDec, Order>(
      this.qImpl.withConverter({
        fromFirestore: fromFirestoreStab(this.fromFirestore),
        toFirestore: toFirestore,
      })
    );
  }
}
