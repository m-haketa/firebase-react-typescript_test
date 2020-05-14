import { useEffect, useState } from 'react';
import * as firebase from 'firebase';

export interface UseFirebaseQueryParams {
  user: firebase.auth.UserCredential;
}

export type Doc = firebase.firestore.DocumentChange['doc'];

export type Get<T> = T & { id: string };

interface GetData {
  <D, U>(doc: Doc, decode: ((fsData: D) => Partial<U>) | undefined): Get<U>;
  <D>(doc: Doc): Get<D>;
}

export const getData: GetData = <D, U = D>(
  doc: Doc,
  decode?: ((fsData: D) => Partial<U>) | undefined
): Get<U> | Get<D> => {
  const data = doc.data() as D;

  if (decode) {
    return { id: doc.id, ...data, ...decode(data) };
  } else {
    return { id: doc.id, ...data };
  }
};

export const useFirebaseSnapshot = <D, U = D>(
  user: firebase.auth.UserCredential | undefined,
  collection: string,
  querySettings: (
    collectionReference: firebase.firestore.CollectionReference
  ) => firebase.firestore.Query,
  decode?: (fsData: D) => Partial<U>
): Get<U>[] => {
  const [data, setData] = useState<Get<U>[]>([]);

  useEffect(() => {
    if (user === undefined) return;

    const documentData = firebase.firestore().collection(collection);

    const query = querySettings(documentData);

    query.onSnapshot((snapshot) => {
      if (!snapshot.size) return null;

      snapshot.docChanges().forEach((change) => {
        if (change.type === 'removed') {
          setData((pDocs) => pDocs.filter((pDoc) => pDoc.id !== change.doc.id));
        } else {
          const changeDoc = getData<D, U>(change.doc, decode);
          setData((pDocs) => {
            const newD = pDocs.filter((pDoc) => pDoc.id !== changeDoc.id);
            return [...newD, changeDoc];
          });
        }
      });
    });
  }, [user, collection, querySettings, decode]);

  return data;
};
