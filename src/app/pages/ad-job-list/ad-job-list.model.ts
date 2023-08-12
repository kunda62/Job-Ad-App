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

export interface ErrorResponse {
  error: Error;
  requestData?: Object[];
  message?: string;
}
export interface Error {
  headers: Headers;
  status: number;
  statusText: string;
  url: string;
  ok: boolean;
  name: string;
  message: string;
  error: any;
}
export interface Headers {
  normalizedNames: Object;
  lazyUpdate?: null;
  headers: Object;
}

export enum JobStatus {
  PUBLISH = 'published',
  ARCHIVE = 'archived',
  DRAFT = 'draft',
  ALL = 'all'
}
