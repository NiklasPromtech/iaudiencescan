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
