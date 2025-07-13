import type { Type } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

type TPickField<T, K extends string> = T extends Record<K, any> ? T[K] : never;

export type TValidationClass<T> = {
  name: string;
  new (...args: any[]): T;
};

export type TCRUDParams = {
  prefix: string;
  useCustomIndexField?: boolean;
  response: Type<any>;
  retrieveResponse?: Type<any>;
  listQuery?: Type<any>;
  listResponse?: Type<any>;
  createRequest?: Type<any>;
  createResponse?: Type<any>;
  updateRequest?: Type<any>;
  updateResponse?: Type<any>;
  deleteRequest?: Type<any>;
  deleteResponse?: Type<any>;
};

export type TSchemaObject = typeof ApiBody extends (a: infer V) => any
  ? TPickField<V, 'schema'>
  : never;

export type TSchemas = {
  [k: string]: TSchemaObject;
};

export type TJSONTypeSchema = Type<any> | undefined;

export type TMapper<Map> = {
  [key in keyof Map]: string;
};

export type TVersionInfo = {
  versions: number[] | undefined;
  name: string;
};

export type TBetterVersion = {
  min?: number;
  max?: number;
};

export type TSwaggerParams = {
  schemaRequest?: TJSONTypeSchema;
  schemaResponse?: TJSONTypeSchema;
  description?: string;
  schemaQuery?: TJSONTypeSchema;
  isAuth?: boolean;
};
