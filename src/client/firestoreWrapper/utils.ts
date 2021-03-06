import * as firebase from 'firebase';
import type { Document } from './types';

export const fromFirestoreStab = <Doc extends Document, DDec>(
  fromFirestore: (dbData: Doc) => DDec
) => (
  snapshot: firebase.firestore.QueryDocumentSnapshot,
  options: firebase.firestore.SnapshotOptions
): DDec => {
  const data = snapshot.data(options);
  return fromFirestore(data as Doc);
};
