
## Fix: BigQuery Date Comparison Syntax in Sample Queries

### What's wrong

All 4 sample queries use:
```sql
WHERE created_at >= CURRENT_DATE
```

BigQuery does not allow comparing a `TIMESTAMP` column to a bare `CURRENT_DATE`. The backend confirmed two valid patterns:

- `WHERE created_at >= CURRENT_TIMESTAMP()` — everything from right now back is not useful here; this would mean "from this exact moment" which isn't what we want
- `WHERE DATE(created_at) = CURRENT_DATE()` — rows where the date part equals today, regardless of time — **this is what we want for "today"**

### The fix

Replace every `created_at >= CURRENT_DATE` with `DATE(created_at) = CURRENT_DATE()` across all 4 sample queries. For the join query, the alias prefix `p.` stays, so it becomes `DATE(p.created_at) = CURRENT_DATE()`.

### Changes — `src/pages/QueryEditor.tsx` (lines 155–193)

| Query | Before | After |
|---|---|---|
| Visitors today | `created_at >= CURRENT_DATE` | `DATE(created_at) = CURRENT_DATE()` |
| Wallet connections today | `created_at >= CURRENT_DATE` | `DATE(created_at) = CURRENT_DATE()` |
| Top pages today | `created_at >= CURRENT_DATE` | `DATE(created_at) = CURRENT_DATE()` |
| Visitors that connected a wallet | `p.created_at >= CURRENT_DATE` | `DATE(p.created_at) = CURRENT_DATE()` |

This is a 4-line change in a single file, no architecture changes needed.
