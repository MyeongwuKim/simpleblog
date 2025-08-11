declare interface QueryResponse<T> extends Response {
  ok: boolean;
  error: string;
  data: T;
}

declare interface FormType {
  title: string;
  tag: string[];
  content: string;
  imageIds?: string[];
}
