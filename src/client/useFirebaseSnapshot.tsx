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

    //本来はcollection、querySettings、decodeも、2つ目の引数に入れるべきと警告が出る
    //だた、３つめのdecode callbackを無名関数で指定すると、snapshot更新のたびに、
    //callback用関数オブジェクトも変わってしまい、さらにこのロジックでsnapshotが起動される
    //、、、と無限に循環してしまう。そのため、user以外の変化時に実行しないように設定する
    //callbackをグローバルで定義するか（たぶん）useCallbackしておけば、collection、
    //querySettings、decodeを2つ目の引数に指定しても問題ない。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return data;
};
