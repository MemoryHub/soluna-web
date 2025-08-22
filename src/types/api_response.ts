
export interface ApiResponse<T = any> {
  recode: number;
  msg: string;
  data: T;
}

// 分页数据结构，用于角色列表等需要分页的接口
export interface PaginatedData<T = any> {
  data: T[];
  total: number;
}
