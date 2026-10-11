# Design Systems

This layer describes how to keep a selected visual identity internally consistent. DashLint MCP currently provides optional reference tokens and design guidance; it does not expose `list_design_systems`, `get_design_system`, or a design-system validator. Preserve an existing product system when available. For a new dashboard, use one coherent palette and type/spacing scale; selection can be made from the user's brief and references without a separate approval step.

## Rules

- **R-DESIGN-01 (Chart Colors Consistent)**: Keep chart colors within the chosen palette and map the same category consistently across views.
- **R-DESIGN-02 (Background/Surface Match)**: Use background and surface colors that belong to the same visual system, with enough contrast for text and chart marks.
- **R-DESIGN-03 (Typography Stack Match)**: Use a consistent type system for headings, labels, body copy, and numeric values; preserve the host app's fonts when present.
- **R-DESIGN-04 (Contextual Style Choice)**: Match an existing product style when extending it. In a new dashboard, choose a sensible coherent default and continue unless the user's preference is materially ambiguous; do not block implementation for routine token choices.

