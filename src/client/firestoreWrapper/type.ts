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

export type DatabaseType = {
  [key: string]: Collection;
};

export type Document = {
  [key: string]: unknown;
};

export type Collection = {
  _documents: Document;
  _collections: { [key: string]: Collection };
};

export type DocumentProps<T extends Collection> = T['_documents'];

export type CollectionProps<T extends Collection> = T['_collections'];

export type WithId<T> = T & { _id: string };

//T、Sがオブジェクトのとき、Sに含まれるの指定のpropertyの方を入れ替える
export type Substitute<T, S> = Omit<T, keyof S> & S;

export interface Decoder<DatabaseSchema, UserSchema> {
  (dbData: DatabaseSchema): Partial<Substitute<DatabaseSchema, UserSchema>>;
}

export interface Encoder<DatabaseSchema, UserSchema> {
  (userData: Substitute<DatabaseSchema, UserSchema>): Partial<DatabaseSchema>;
}
