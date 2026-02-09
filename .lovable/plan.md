

# Fix Dual-Handle Slider for Start and End Date Selection

## Problem

The current `Slider` component only renders a single `<SliderPrimitive.Thumb>`. Radix UI Slider requires one `Thumb` element per value in the array. Since `basicRange` is `[number, number]` (two values), we need two thumbs rendered.

## Solution

Update `src/components/ui/slider.tsx` to render **two Thumb elements** instead of one. This is a small, targeted fix -- just duplicate the `<SliderPrimitive.Thumb>` inside the component. This will make both the start and end handles draggable on the Change page (and won't break single-value sliders elsewhere since Radix ignores extra thumbs).

## Technical details

**File: `src/components/ui/slider.tsx`**
- Add a second `<SliderPrimitive.Thumb>` element with the same styling
- Radix automatically assigns thumbs to values in order -- first thumb = first value (start), second thumb = second value (end)

