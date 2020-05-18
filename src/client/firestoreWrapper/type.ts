export type Timestamp = firebase.firestore.Timestamp;

//collection-document-collection・・・の構造を、オブジェクトで表す。
//
//例：
//export type Database = {
//  restaurants: {
//    _documents: {
//      avgRating: number;
//      category: string;
//      city: string;
//      name: string;
//      numRatings: number;
//      photo: string;
//      price: number;
//    };
//    _collections: {
//      ratings: {
//        _documents: {
//          rating: number;
//          text: string;
//          timestamp: Timestamp;
//          userId: string;
//          userName: string;
//        };
//        _collections: {};
//      };
//    };
//  };
//};

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
