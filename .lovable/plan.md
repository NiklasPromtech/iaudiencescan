
## Fix: `sql-generate` Edge Function Not Deployed

### Root cause

The network log shows the call to `sql-generate` fails with `Error: Failed to fetch` — meaning the edge function doesn't exist on the Supabase project yet. The code is correct; the function simply hasn't been deployed.

The `supabase/config.toml` has the entry:
```toml
[functions.sql-generate]
verify_jwt = false
```

And the function file exists at `supabase/functions/sql-generate/index.ts`. But Lovable only deploys edge functions when the file is saved/modified. Because this function was created before recent deployments, it may not have been pushed.

### The fix

Touch (re-save) `supabase/functions/sql-generate/index.ts` with a trivial no-op change (e.g. add/remove a trailing newline or a comment) to trigger a fresh deploy. This is the standard way to force Lovable to redeploy an edge function.

At the same time, there is a minor issue in the function: it uses `verify_jwt = false` in config.toml but still manually validates the JWT inside the function body. This is correct and intentional (manual validation gives us the user object for auth). No change needed there.

### What will be changed

**`supabase/functions/sql-generate/index.ts`** — add a single-line comment at the top to trigger redeployment. Zero logic changes.

That's the entire fix — one file, one line added.
