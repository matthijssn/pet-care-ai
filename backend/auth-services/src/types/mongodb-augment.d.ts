import { Document } from 'mongoose';

declare module 'mongodb' {
  export interface Cursor<TSchema = Document> {
    [Symbol.asyncIterator](): AsyncIterableIterator<TSchema>;
  }
}

declare module 'mongoose' {
  interface CursorOptions {
    batchSize?: number;
    limit?: number;
    skip?: number;
    sort?: Record<string, 1 | -1>;
  }

  export interface Cursor<DocType = Document> extends AsyncIterable<DocType> {
    [Symbol.asyncIterator](): AsyncIterableIterator<DocType>;
  }
}