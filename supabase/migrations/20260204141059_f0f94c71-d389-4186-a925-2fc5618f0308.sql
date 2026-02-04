-- Add cost fields to touchpoints table for marketing spend tracking
ALTER TABLE public.touchpoints
ADD COLUMN cost_amount numeric(12, 2) DEFAULT NULL,
ADD COLUMN cost_currency text DEFAULT 'USD';

-- Add comment for documentation
COMMENT ON COLUMN public.touchpoints.cost_amount IS 'Marketing spend for this event. Used to calculate incremental_cpa = amount / incremental_visitors';
COMMENT ON COLUMN public.touchpoints.cost_currency IS 'Currency code for display purposes (no conversion performed)';