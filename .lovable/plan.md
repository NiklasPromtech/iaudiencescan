

# Redesign Query Editor: Dune-Style AI Prompt Section

## What Changes

Remove the **Sample Queries chips** and **Copy Schema bar** from above the SQL editor. Add a Dune-inspired "Get started" section below the editor (in the results area, when no query has been run yet) with an AI prompt input and example prompt cards.

## Changes to `src/pages/QueryEditor.tsx`

### Remove (lines 1055-1089)
- The `SAMPLE_QUERIES` array (lines 442-526) -- delete entirely
- The `PROMPT_CHIPS` array (lines 530-536) -- delete entirely  
- The sample query chips row (lines 1056-1075)
- The "Copy Schema" bar (lines 1076-1089)
- The `schemaCopied` state and `handleCopySchema` callback (no longer needed)

### Add: "Get started" section in the empty results area
Replace the current empty state (lines 1109-1116, the "Run your query to see results" message) with a Dune-style section containing:

1. **Header row**: "Get started" label
2. **"Generate with a prompt" input**: A text input with sparkles icon, placeholder "Enter prompt to generate SQL", that submits on Enter. Calls the existing `handleGenerate()` function.
3. **Example prompt cards**: 3 clickable cards with relevant AudienceScan prompts that populate the input when clicked:
   - "What are users clicking on the home page?"
   - "What is the median wallet balance of users visiting the product page?"
   - "How many users with a wallet extension landed on the token swap page?"

The prompt input and generate logic already exist (`prompt`, `setPrompt`, `handleGenerate`, `isGenerating`). We just move the UI from wherever it currently lives into the empty-results area.

### Layout
When `!hasRun` (no query executed yet), the results area shows:
```
+------------------------------------------+
| Get started                              |
|                                          |
| (sparkles) Generate with a prompt    (i) |
| [Enter prompt to generate SQL........]   |
|                                          |
| +------------+ +------------+ +--------+ |
| | What are   | | Median     | | Users  | |
| | users      | | wallet     | | with   | |
| | clicking   | | balance of | | wallet | |
| | on home    | | users on   | | ext on | |
| | page?      | | product pg | | swap   | |
| +------------+ +------------+ +--------+ |
+------------------------------------------+
```

Once a query has been run, this section disappears and results/error/loading show as before.

## Files Modified
- `src/pages/QueryEditor.tsx` only

