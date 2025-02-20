export interface ISearchParams {
  pageIndex?: number;
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
export interface ClientFilter {
  name?: string;
  region?: string;
  country?: string;
  language?: string;
}
export interface ShiftFilter {
  name?: string;
  fromTime?: string;
  toTime?: string;
  tolerance?: string;
  expectedHours?: string;
  isSplit?: boolean;
  clientId?: number;
}


export interface UserSearchParams extends UserFilter, ISearchParams {}
export interface ClientSearchParams extends ClientFilter, ISearchParams {}
export interface ShiftSearchParams extends ShiftFilter, ISearchParams {}
