module.exports = {
  // Use the modern PostCSS SCSS parser so Stylelint fully understands
  // newer Sass features (e.g. @use, @forward, !default etc.).
  customSyntax: "postcss-scss",

  // Extend the widely-used community presets for sensible defaults
  extends: [
    "stylelint-config-standard-scss", // standard + SCSS rules
  ],

  plugins: [
    "./.stylelint/plugins/no-literal-cubic-bezier.js", // custom StarryNight rule
    "stylelint-scss", // SCSS specific linting helpers
    "stylelint-declaration-strict-value", // enforce design-tokens for values
    "stylelint-order", // property ordering
    "stylelint-use-nesting", // encourage the modern @nest pattern
  ],

  rules: {
    // ─────────────────────────────────────────────────────────────
    // StarryNight custom bans
    // ─────────────────────────────────────────────────────────────
    // Prevent direct use of cubic-bezier() – enforce easing tokens instead
    "plugin/no-literal-cubic-bezier": [true],

    // Enforce CSS-variable or token usage for colour-like props
    "scale-unlimited/declaration-strict-value": [
      [
        "/color/",
        "fill",
        "stroke",
        "box-shadow",
        "border",
        "background",
        "background-color",
      ],
      {
        ignoreValues: ["currentColor", "transparent", "inherit", "var", "none"],
      },
    ],

    // Require kebab-case SCSS $variables prefixed with sn- for clarity
    "scss/dollar-variable-pattern": [
      "^sn-[a-z0-9-]+$",
      {
        message: "$variable names should be kebab-case and start with sn-",
      },
    ],

    // Force custom property naming convention ( --sn- or --spice- )
    "custom-property-pattern": [
      "^(--sn|--spice)-[a-z0-9-]+$",
      {
        message: "CSS custom properties must begin with --sn- or --spice-",
      },
    ],

    // ─────────────────────────────────────────────────────────────
    // Maintainability & ordering
    // ─────────────────────────────────────────────────────────────
    "order/properties-alphabetical-order": true,
    "order/order": [
      "custom-properties",
      "dollar-variables",
      { type: "at-rule", name: "include" },
      "declarations",
      "rules",
    ],

    // Encourage @nest over child selector concat (modern CSS)
    "csstools/use-nesting": "always",
  },
};
