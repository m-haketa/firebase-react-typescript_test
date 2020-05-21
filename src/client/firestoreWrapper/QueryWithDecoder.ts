import * as firebase from 'firebase';
import { fromFirestoreStab } from './utils';
import { Query } from './Query';

import type { Document, SubCollections, Encoder } from './type';

export class QueryWithDecoder<
  Doc extends Document,
  SubCols extends SubCollections,
  DDec = Doc,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Order extends { [key: string]: any }[] = []
> {
  constructor(
    private qImpl: firebase.firestore.Query,
    protected fromFirestore: (dbData: Doc) => DDec
  ) {}

  withEncoder(
    toFirestore: Encoder<Doc, DDec>
  ): Query<Doc, SubCols, DDec, Order> {
    return new Query<Doc, SubCols, DDec, Order>(
      this.qImpl.withConverter({
        fromFirestore: fromFirestoreStab(this.fromFirestore),
        toFirestore: toFirestore,
      })
    );
  }
}
