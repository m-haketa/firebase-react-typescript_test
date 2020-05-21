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

// firestore関数に渡すデータの形式
export type DatabaseType = {
  [key: string]: Collection;
};

export type Document = {
  [key: string]: unknown;
};

export type SubCollections = {
  [key: string]: Collection;
};

export type Collection = {
  _documents: Document;
  _collections: SubCollections;
};

//Collection型からdocumentの型を取り出す
export type DocumentProps<T extends Collection> = T['_documents'];

//Collection型からsubCollectionの型を取り出す
export type SubCollectionProps<T extends Collection> = T['_collections'];

//fetch時にdoc.idを自動付加するために_idプロパティを追加
export type WithId<T> = T & { _id: string };

//T、Sがオブジェクトのとき、Sに含まれるの指定のpropertyの方を入れ替える
export type Substitute<T, S> = Omit<T, keyof S> & S;

//TのキーにSのキーが含まれない場合にはSubstituteしない型
export type SubstAndPick<T, S> = keyof T extends keyof S ? Substitute<T, S> : T;

export interface Decoder<DatabaseSchema, UserSchema> {
  (dbData: DatabaseSchema): UserSchema;
}

export interface Encoder<DatabaseSchema, UserSchema> {
  (userData: UserSchema): DatabaseSchema;
}

//タプルの末尾に指定した型を追加
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Push<List extends any[], A> = {
  0: [A];
  1: [List[0], A];
  2: [List[1], List[0], A];
  3: [List[2], List[1], List[0], A];
  4: [List[3], List[2], List[1], List[0], A];
  5: [List[4], List[3], List[2], List[1], List[0], A];
  6: [List[5], List[4], List[3], List[2], List[1], List[0], A];
  7: [List[6], List[5], List[4], List[3], List[2], List[1], List[0], A];
  8: [
    List[7],
    List[6],
    List[5],
    List[4],
    List[3],
    List[2],
    List[1],
    List[0],
    A
  ];
}[List['length'] extends 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  ? List['length']
  : never];

//|を&に修正
export type UnionToIntersection<U> = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  U extends any
    ? (k: U) => void
    : never
) extends (k: infer I) => void
  ? I
  : never;

// [{ value: number }, { name: string }]を、{ value: number, name: string }に変形
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ObjectStyle<T extends any[]> = UnionToIntersection<T[number]>;

// 単一のオブジェクトを要素とする配列Tから、指定した添え字Nに対応するオブジェクトの型を取得する
// 例：T = [{ value: number }, { name: string }]、N=0 → number
// 例：T = [{ value: number }, { name: string }]、N=1 → string
type TypeOfObjectArr<T, N extends keyof T> = T[N][keyof T[N]];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Length<T extends any[]> = T['length'];

// 単一のオブジェクトを要素とする配列Tを、それぞれのオブジェクトの型のタプルに変形
// 例：T = [{ value: number }, { name: string }] → [number, string]
// TODO: 上限5オブジェクトまでしか変形できないので注意
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TupleStyle<T extends any[]> = Length<T> extends 1
  ? [TypeOfObjectArr<T, 0>]
  : Length<T> extends 2
  ? [TypeOfObjectArr<T, 0>, TypeOfObjectArr<T, 1>]
  : Length<T> extends 3
  ? [TypeOfObjectArr<T, 0>, TypeOfObjectArr<T, 1>, TypeOfObjectArr<T, 2>]
  : Length<T> extends 4
  ? [
      TypeOfObjectArr<T, 0>,
      TypeOfObjectArr<T, 1>,
      TypeOfObjectArr<T, 2>,
      TypeOfObjectArr<T, 3>
    ]
  : Length<T> extends 5
  ? [
      TypeOfObjectArr<T, 0>,
      TypeOfObjectArr<T, 1>,
      TypeOfObjectArr<T, 2>,
      TypeOfObjectArr<T, 3>,
      TypeOfObjectArr<T, 4>
    ] // eslint-disable-next-line @typescript-eslint/no-explicit-any
  : any[];

// 単一のオブジェクトを要素とする配列Tの、指定したオブジェクトとプロパティが一致するものがあれば置き換える
// 例：T = [{ value: number }, { name: string }] 、 S = { value: boolean }
//       → [{ value: boolean }, { name: string }]
// TODO: 上限5オブジェクトまでしか変形できないので注意
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SubstituteObjArr<T extends any[], S> = Length<T> extends 1
  ? [SubstAndPick<T[0], S>]
  : Length<T> extends 2
  ? [SubstAndPick<T[0], S>, SubstAndPick<T[1], S>]
  : Length<T> extends 3
  ? [SubstAndPick<T[0], S>, SubstAndPick<T[1], S>, SubstAndPick<T[2], S>]
  : Length<T> extends 4
  ? [
      SubstAndPick<T[0], S>,
      SubstAndPick<T[1], S>,
      SubstAndPick<T[2], S>,
      SubstAndPick<T[3], S>
    ]
  : Length<T> extends 5
  ? [
      SubstAndPick<T[0], S>,
      SubstAndPick<T[1], S>,
      SubstAndPick<T[2], S>,
      SubstAndPick<T[3], S>,
      SubstAndPick<T[4], S>
    ] // eslint-disable-next-line @typescript-eslint/no-explicit-any
  : any[];

/*
type OrderA1 = Push<[{ value: number }], { name: string }>;
type OrderA2 = Push<OrderA1, { title: boolean }>;

type AT = TupleStyle<OrderA2>;
type AO = ObjectStyle<OrderA2>;

type OrderB = [{ value: number }];

type BT = TupleStyle<OrderB>;
type BO = ObjectStyle<OrderB>;

type C = SubstituteObjArr<OrderA1, { value: boolean }>;

const c: C = [{ value: false }, { name: 'a' }];
*/
