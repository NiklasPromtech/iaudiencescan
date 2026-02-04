-- Add chain_id column to website_tag_contracts
ALTER TABLE public.website_tag_contracts
ADD COLUMN chain_id text;

-- Update existing records to have chain_id based on chain name
UPDATE public.website_tag_contracts SET chain_id = 'eth-mainnet' WHERE chain = 'ethereum';
UPDATE public.website_tag_contracts SET chain_id = 'matic-mainnet' WHERE chain = 'polygon';
UPDATE public.website_tag_contracts SET chain_id = 'bsc-mainnet' WHERE chain = 'bsc';
UPDATE public.website_tag_contracts SET chain_id = 'avalanche-mainnet' WHERE chain = 'avalanche';
UPDATE public.website_tag_contracts SET chain_id = 'arbitrum-mainnet' WHERE chain = 'arbitrum';
UPDATE public.website_tag_contracts SET chain_id = 'base-mainnet' WHERE chain = 'base';