
export interface ApiResponse<T = any> {
  recode: number;
  msg: string;
  data: T;
}
