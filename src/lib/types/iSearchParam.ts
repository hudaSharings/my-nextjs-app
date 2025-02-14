export interface ISearchParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface UserFilter {
  name?: string;
  userName?: string;
  email?: string;
  userType?: string;
}
export interface UserSearchParams extends UserFilter, ISearchParams {}
