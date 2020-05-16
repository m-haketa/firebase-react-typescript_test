export type Timestamp = firebase.firestore.Timestamp;

//collection-document-collection・・・の構造を、オブジェクトで表す。
//{
//  collection1: {
//    documentprops1: string;
//    ...
//    documentpropsn: boolean;
//
//    collection2: {
//      documentprops1: string;
//      ...
//      documentpropsn: boolean;
//    }
//  }
//}
//中身がobject（Date、Timestampを除く）のものはcollectionとみなす。
//残りは、documentとして取り扱う。
//
//そこで、propertyのデータ型がprimitiveかどうかを判断するtypeを作る。
//TimestampとDateはPrimitiveとして扱う
export type KeyOfPrimitiveValue<T> = {
  [K in keyof T]: T[K] extends Timestamp
    ? K
    : T[K] extends Date
    ? K
    : T[K] extends object
    ? never //Timestamp、Date型以外のobjectは、collectionの名前とみなす
    : K;
} extends { [_ in keyof T]: infer X }
  ? X
  : never;

export type DocumentProps<T> = Pick<T, KeyOfPrimitiveValue<T>>;

export type CollectionProps<T> = Omit<T, KeyOfPrimitiveValue<T>>;
