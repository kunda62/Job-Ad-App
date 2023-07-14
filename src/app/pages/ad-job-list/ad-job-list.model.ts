export interface PaginationParams {
  _page: number;
  _limit: number;
  _like?: string;
  _q?: string;
}

export interface JobAdData {
  description: string;
  title: string;
  skills: string[];
  status: string;
  id: number;
}

export interface HtppResponse {
  headers: any
  status: number
  statusText: string
  url: string
  ok: boolean
  type: number
  body: JobAdData[]
}

export interface JobAdResponse {
  totalCount: number;
  data: JobAdData[];
}