-- Auto-populate chain_id from chain for website_tag_contracts

CREATE OR REPLACE FUNCTION public.website_tag_contracts_set_chain_id()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
DECLARE
  c text;
BEGIN
  c := lower(trim(coalesce(NEW.chain, '')));

  IF TG_OP = 'INSERT'
     OR NEW.chain IS DISTINCT FROM OLD.chain
     OR NEW.chain_id IS NULL
     OR NEW.chain_id = '' THEN

    NEW.chain_id := CASE c
      WHEN 'ethereum' THEN 'eth-mainnet'
      WHEN 'polygon' THEN 'matic-mainnet'
      WHEN 'bsc' THEN 'bsc-mainnet'
      WHEN 'bnb smart chain (bsc)' THEN 'bsc-mainnet'
      WHEN 'avalanche' THEN 'avalanche-mainnet'
      WHEN 'avalanche c-chain' THEN 'avalanche-mainnet'
      WHEN 'fantom' THEN 'fantom-mainnet'
      WHEN 'arbitrum' THEN 'arbitrum-mainnet'
      WHEN 'base' THEN 'base-mainnet'
      ELSE NULL
    END;
  END IF;

  -- Enforce that supported chains always have a chain_id for cron processing
  IF NEW.chain_id IS NULL THEN
    RAISE EXCEPTION 'Unsupported chain for website_tag_contracts: %', NEW.chain
      USING ERRCODE = '22000';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_website_tag_contracts_set_chain_id ON public.website_tag_contracts;

CREATE TRIGGER trg_website_tag_contracts_set_chain_id
BEFORE INSERT OR UPDATE ON public.website_tag_contracts
FOR EACH ROW
EXECUTE FUNCTION public.website_tag_contracts_set_chain_id();
