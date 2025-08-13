declare interface QueryResponse<T> {
  ok: boolean;
  error: string;
  data: T;
}

declare interface PostType {
  title: string;
  tag: string[];
  content: string;
  imageIds?: string[];
  preview?: string | null;
  thumbnail?: string | null;
}
