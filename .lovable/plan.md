
Goal: fix the loading indicator so it clearly spins (not “bouncing”) when a SQL request is in progress.

What I found:
- The loading state logic itself is now in the correct order (`isRunning` before `!hasRun`), so the right branch should render.
- The visual issue is caused by CSS transform conflicts on some loader icons in `QueryEditor`.
- In `src/pages/QueryEditor.tsx`, the inline loaders for prompt/edit use:
  - `top-1/2 -translate-y-1/2 ... animate-spin`
- `-translate-y-1/2` and `animate-spin` both write to `transform`. Because the spin keyframes animate `transform`, the translate gets overridden during animation, which creates the “drops down / jumps up” behavior instead of a stable centered spinner.

Implementation plan:
1. Update spinner positioning pattern in `QueryEditor` to avoid transform conflicts.
   - Replace each `Loader2` that combines `-translate-y-1/2` + `animate-spin` with a wrapper that handles vertical centering, and keep spin only on the icon.
   - Recommended structure:
     - Wrapper: `absolute right-3 inset-y-0 flex items-center`
     - Icon: `h-3.5 w-3.5 animate-spin text-muted-foreground`
2. Apply this to both affected places:
   - Edit SQL prompt loader (around current line ~1004)
   - Generate prompt loader (around current line ~1066)
3. Keep existing loading state copy and behavior (“Running…”, disabled inputs/buttons) unchanged, since the issue is visual animation fidelity, not state transition logic.

Why this approach:
- It preserves current UX and logic while fixing the root CSS conflict.
- It follows existing Tailwind patterns and avoids introducing custom CSS or new dependencies.
- It’s low-risk and localized to two elements.

Validation checklist (after implementation):
- Trigger “Generate with a prompt” and confirm the spinner rotates smoothly without vertical jumping.
- Trigger “Edit SQL with prompt” and confirm same behavior.
- Trigger “Run” and ensure top run button + results loading state still behave correctly.
- Verify no layout shift in the input fields while loading.

Technical notes:
- This is a classic Tailwind transform collision:
  - `-translate-y-1/2` needs `transform`
  - `animate-spin` keyframes animate `transform`
- Splitting centering and spinning across wrapper/child avoids competing `transform` declarations.
