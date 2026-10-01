# Changelog

## 0.1.1

- Remove full-bar widget reconstruction after a drop. Unrelated widgets stay
  alive; reordering within a group preserves every live widget instance.
- Add Qt regression tests for delegate identity, settings updates, and model edits.

## 0.1.0

- Split the top bar around an Apple Silicon MacBook camera notch.
- Drag widgets to the screen edges or either notch edge, including empty groups.
- Keep widget settings and persist placement through the Omarchy shell.
- Wrap crowded groups and reserve their full height.
- Configure notch width, height, padding, and whether splitting is enabled.
- Keep the normal layout on external displays and other bar positions.
