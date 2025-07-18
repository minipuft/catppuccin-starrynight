import fs from "fs";
import glob from "glob";
import path from "path";

describe("Stylelint – cubic-bezier usage", () => {
  const scssFiles = glob.sync(path.resolve(__dirname, "../src/**/*.scss"));

  it("contains no raw cubic-bezier() declarations (should use --sn-easing- tokens)", () => {
    const offending: string[] = [];
    const regex = /cubic-bezier\([^)]*\)/g;

    scssFiles.forEach((file) => {
      const content = fs.readFileSync(file, "utf8");
      const matches = content.match(regex) || [];
      matches.forEach((match) => {
        // Allow when defining CSS custom properties
        const propertyDefinitionPattern = new RegExp(
          `--sn-[^:]*:\\s*${match.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          )}`
        );
        
        // Allow when wrapped in var(--sn-easing-foo, cubic-bezier(...))
        const fallbackPattern = new RegExp(
          `var\\(--sn-easing-[^,]+,\\s*${match.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          )}\\)`
        );
        
        // Allow when used as fallback in var() functions
        const varFallbackPattern = new RegExp(
          `var\\([^,]+,\\s*${match.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          )}\\)`
        );
        
        if (!propertyDefinitionPattern.test(content) && 
            !fallbackPattern.test(content) && 
            !varFallbackPattern.test(content)) {
          offending.push(`${file}: ${match}`);
        }
      });
    });

    expect(offending).toEqual([]);
  });
});
