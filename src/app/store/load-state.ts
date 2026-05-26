export interface LoadState<T> {
  data: T[];
  loading: boolean;
  error: string;
}
