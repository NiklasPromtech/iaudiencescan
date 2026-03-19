/**
 * Template variable support for SQL queries.
 *
 * Syntax:  {{variable_name, "default_value"}}  or  {{variable_name}}
 *
 * - `parseVariables(sql)` extracts all template tokens.
 * - `substituteVariables(sql, values)` replaces tokens with supplied values.
 */

export interface QueryVariable {
  name: string;
  defaultValue: string | null;
  /** Full token text, e.g. `{{days_back, "14"}}` */
  token: string;
}

const VAR_REGEX = /\{\{\s*([a-zA-Z_]\w*)(?:\s*,\s*"([^"]*)")?\s*\}\}/g;

/**
 * Parse all template variables from a SQL string.
 * Deduplicates by name (first occurrence wins).
 */
export function parseVariables(sql: string): QueryVariable[] {
  const seen = new Set<string>();
  const vars: QueryVariable[] = [];
  let match: RegExpExecArray | null;
  // Reset lastIndex for safety
  VAR_REGEX.lastIndex = 0;
  while ((match = VAR_REGEX.exec(sql)) !== null) {
    const name = match[1];
    if (seen.has(name)) continue;
    seen.add(name);
    vars.push({
      name,
      defaultValue: match[2] ?? null,
      token: match[0],
    });
  }
  return vars;
}

/**
 * Build a map of variable name → default value for all variables that have one.
 */
export function buildDefaults(vars: QueryVariable[]): Record<string, string> {
  const defaults: Record<string, string> = {};
  for (const v of vars) {
    if (v.defaultValue !== null) {
      defaults[v.name] = v.defaultValue;
    }
  }
  return defaults;
}

/**
 * Check whether all variables are satisfied (have a value in the map).
 */
export function allVariablesSatisfied(
  vars: QueryVariable[],
  values: Record<string, string>
): boolean {
  return vars.every((v) => {
    const val = values[v.name] ?? v.defaultValue;
    return val !== null && val !== undefined && val !== "";
  });
}

/**
 * Substitute template tokens with provided values.
 * Falls back to the default value if no explicit value is provided.
 * Tokens without a value or default are left as-is.
 */
export function substituteVariables(
  sql: string,
  values: Record<string, string>
): string {
  VAR_REGEX.lastIndex = 0;
  return sql.replace(VAR_REGEX, (fullMatch, name: string, defaultVal?: string) => {
    const val = values[name] ?? defaultVal;
    if (val === undefined || val === null) return fullMatch;
    return val;
  });
}

/**
 * Check if a SQL string contains any template variables.
 */
export function hasVariables(sql: string): boolean {
  VAR_REGEX.lastIndex = 0;
  return VAR_REGEX.test(sql);
}
