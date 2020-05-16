export type Timestamp = firebase.firestore.Timestamp;

export type KeyOfPrimitiveValue<T> = {
  [K in keyof T]: T[K] extends string
    ? K
    : T[K] extends number
    ? K
    : T[K] extends boolean
    ? K
    : T[K] extends Timestamp
    ? K
    : never;
} extends { [_ in keyof T]: infer X }
  ? X
  : never;

export type DocumentProps<T> = Pick<T, KeyOfPrimitiveValue<T>>;

export type CollectionProps<T> = Omit<T, KeyOfPrimitiveValue<T>>;
