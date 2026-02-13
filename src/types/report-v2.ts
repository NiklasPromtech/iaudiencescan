export interface GuardrailCheck {
  threshold: number;
  actual: number;
  met: boolean;
}

export interface KpiMetric {
  baseline: number;
  event: number;
  delta: number;
  delta_percent: number;
  low_confidence: boolean;
}

export interface WalletBucket {
  label: string;
  baseline_percent: number;
  event_percent: number;
  delta_percent: number;
}

export interface BehaviorItem {
  behavior: string;
  baseline_rate: number;
  event_rate: number;
  delta: number;
  delta_percent: number;
  low_confidence: boolean;
}

export interface ClickChangeItem {
  href: string;
  click_text: string;
  baseline_clicks: number;
  event_clicks: number;
  delta: number;
  delta_percent: number;
}

export interface DimensionMetric {
  baseline: number;
  event: number;
  delta: number;
  delta_percent: number;
  low_confidence: boolean;
}

export interface DimensionRow {
  dimension_value: string;
  sessions?: DimensionMetric;
  wallet_connect_rate?: DimensionMetric;
  conversion_rate?: DimensionMetric;
  bounce_rate?: DimensionMetric;
  [key: string]: DimensionMetric | string | undefined;
}

export interface ContributionItem {
  dimension: string;
  dimension_value: string;
  metric: string;
  baseline_value: number;
  event_value: number;
  absolute_delta: number;
  contribution_percent: number;
}

export interface AnomalyCandidate {
  dimension: string;
  dimension_value: string;
  metric: string;
  baseline_value: number;
  event_value: number;
  absolute_delta: number;
  relative_change: number;
  score: number;
}

export interface ReportV2Response {
  success: boolean;
  website_id: string;
  windows: {
    baseline_start: string;
    baseline_end: string;
    event_start: string;
    event_end: string;
    baseline_days: number;
    event_days: number;
  };
  guardrails: {
    min_sessions: GuardrailCheck;
    min_wallet_connections: GuardrailCheck;
    min_conversions: GuardrailCheck;
    min_baseline_observations: GuardrailCheck;
    enrichment_coverage: GuardrailCheck;
    overall_low_confidence: boolean;
  };
  kpi_overview: {
    sessions: KpiMetric;
    unique_visitors: KpiMetric;
    bounce_rate: KpiMetric;
    wallet_detect_rate: KpiMetric;
    wallet_connect_rate: KpiMetric;
    conversion_rate: KpiMetric;
    avg_session_duration_seconds: KpiMetric;
  };
  wallet_distribution_shift: {
    median_usd: KpiMetric;
    p75_usd: KpiMetric;
    p90_usd: KpiMetric;
    max_usd: KpiMetric;
    whale_count: KpiMetric;
    buckets: WalletBucket[];
    enrichment_coverage_percent: KpiMetric;
    low_confidence: boolean;
  };
  behavior_changes: {
    items: BehaviorItem[];
    outbound_click_gainers?: ClickChangeItem[];
    outbound_click_losers?: ClickChangeItem[];
    internal_click_gainers?: ClickChangeItem[];
    internal_click_losers?: ClickChangeItem[];
  };
  dimension_performance: {
    utm_campaign?: DimensionRow[];
    utm_source?: DimensionRow[];
    country?: DimensionRow[];
    referrer_domain?: DimensionRow[];
    page_path?: DimensionRow[];
  };
  contribution_to_change: ContributionItem[];
  anomaly_candidates: AnomalyCandidate[];
  errors: string[];
}
