

## Fix: api-proxy Silent Deploy Failure

### Problem
The `api-proxy` edge function fails to deploy silently. It never appears in the Supabase Edge Functions dashboard despite correct file structure and config.

### Root Cause
Line 110 uses optional catch binding (`catch {}`), which may not be supported by the Supabase edge runtime parser. All other working functions use `catch (error)` or `catch (error: any)`.

### Fix
One-line change in `supabase/functions/api-proxy/index.ts`:

Change line 110 from:
```
} catch {
```
to:
```
} catch (_e) {
```

### After the Fix
1. Publish the project
2. Check the Supabase Edge Functions dashboard for `api-proxy`
3. Test with a direct curl to `https://wksyyydmgpcaxdijalqf.supabase.co/functions/v1/api-proxy/analytics/scorecard`
4. Test end-to-end through OpenClaw

