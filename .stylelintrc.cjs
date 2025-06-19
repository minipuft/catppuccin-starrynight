module.exports = {
  plugins: ["./.stylelint/plugins/no-literal-cubic-bezier.js"],
  rules: {
    // Prevent direct use of cubic-bezier() – enforce easing tokens instead
    "plugin/no-literal-cubic-bezier": [true],
  },
};
