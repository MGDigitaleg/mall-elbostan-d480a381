

# Fix: Map Clipping Instead of Fitting

## Problem
The `max-h` constraint combined with `overflow-hidden` is cutting off the map visually instead of scaling it down to fit within the viewport. The SVG map needs to shrink proportionally, not get clipped.

## Solution
Remove the `max-h` + `overflow-hidden` approach and instead use `aspect-ratio` with controlled width so the map scales down naturally within the viewport. The SVG already uses `preserveAspectRatio="xMidYMid meet"` which handles scaling — the container just needs to allow it.

## Changes

### 1. `src/pages/InteractiveMap.tsx` — Fix map container sizing
- Remove `max-h-[calc(100vh-200px)]` and `max-h-[calc(100vh-260px)]` from the map container
- Remove `overflow-hidden` from the map container (keep it on the inner MallFloorMap component which already has its own overflow handling)
- Add `aspect-square` to the map container so it maintains proportional sizing
- Add `max-w-[calc(100vh-220px)] lg:max-w-[calc(100vh-280px)]` to limit the width based on viewport height, which naturally constrains the square map to fit on screen
- Add `mx-auto` to center the map when it shrinks
- Keep the fullscreen mode logic as-is (with `fixed inset-0`)

### 2. `src/components/map/MallFloorMap.tsx` — Ensure SVG fills container
- Confirm the SVG `viewBox` and `preserveAspectRatio` are correct (they are — no change needed here)
- The component's own `overflow-hidden` on the outer div is fine for zoom/pan clipping

## Result
The map will scale down proportionally to fit the viewport height on both mobile and desktop, without any clipping. The fullscreen button continues to work for users who want a larger view.

