const stylelint = require("stylelint");

const ruleName = "plugin/no-literal-cubic-bezier";
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: () =>
    "Use easing token (var(--sn-easing-* …)) instead of literal cubic-bezier()",
});

module.exports = stylelint.createPlugin(ruleName, (primaryOption) => {
  return (root, result) => {
    if (!primaryOption) return;

    root.walkDecls((decl) => {
      const value = decl.value;
      if (/cubic-bezier\(/i.test(value)) {
        // Allow when the curve is inside a fallback of a var() referencing our easing tokens
        if (/var\(--sn-easing-/i.test(value)) return;
        stylelint.utils.report({
          message: messages.rejected(),
          node: decl,
          result,
          ruleName,
        });
      }
    });
  };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;
