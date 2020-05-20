import * as firebase from 'firebase';
import type { Collection, DocumentProps } from './type';

export const fromFirestoreStab = <D extends Collection, DDec>(
  fromFirestore: (dbData: DocumentProps<D>) => DDec
) => (
  snapshot: firebase.firestore.QueryDocumentSnapshot,
  options: firebase.firestore.SnapshotOptions
): DDec => {
  const data = snapshot.data(options);
  return fromFirestore(data);
};
