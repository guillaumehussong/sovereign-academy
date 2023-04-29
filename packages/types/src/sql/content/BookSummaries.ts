// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { BooksId } from './Books';

/** Identifier type for content.book_summaries */
export type BookSummariesId = number;

/** Represents the table content.book_summaries */
export default interface BookSummaries {
  id: BookSummariesId;

  book_id: BooksId;

  contributor_id: string | null;

  summary: string;
}

/** Represents the initializer for the table content.book_summaries */
export interface BookSummariesInitializer {
  /** Default value: nextval('content.book_summaries_id_seq'::regclass) */
  id?: BookSummariesId;

  book_id: BooksId;

  contributor_id?: string | null;

  summary: string;
}

/** Represents the mutator for the table content.book_summaries */
export interface BookSummariesMutator {
  id?: BookSummariesId;

  book_id?: BooksId;

  contributor_id?: string | null;

  summary?: string;
}
