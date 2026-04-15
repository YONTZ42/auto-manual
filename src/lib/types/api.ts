export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface SearchRequest {
  q: string;
  storeId?: string;
}

export interface SearchResponse {
  contents: import('./content').Content[];
  items: import('./location').Item[];
}

export interface PaginationCursor {
  updatedAt: string;
  id: string;
}
