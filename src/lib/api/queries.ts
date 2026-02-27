import { apiRequest } from "./client";

export interface QuerySchemaColumn {
  name: string;
  type: string;
  description: string;
}

export interface QuerySchemaTable {
  name: string;
  description: string;
  columns: QuerySchemaColumn[];
}

export interface QuerySchemaResponse {
  tables: QuerySchemaTable[];
}

export interface QueryExecuteResponse {
  columns: string[];
  rows: (string | number | null)[][];
  row_count: number;
}

export async function fetchQuerySchema(): Promise<QuerySchemaResponse> {
  return apiRequest<QuerySchemaResponse>("/query/schema");
}

export async function executeQuery(websiteId: string, sql: string): Promise<QueryExecuteResponse> {
  return apiRequest<QueryExecuteResponse>("/query", {
    method: "POST",
    body: JSON.stringify({ website_id: websiteId, sql }),
  });
}

export interface QueryGenerateResponse {
  sql: string;
  explanation: string;
  name: string;
}

export async function generateQuery(websiteId: string, prompt: string): Promise<QueryGenerateResponse> {
  return apiRequest<QueryGenerateResponse>("/query/generate", {
    method: "POST",
    body: JSON.stringify({ website_id: websiteId, prompt }),
  });
}
