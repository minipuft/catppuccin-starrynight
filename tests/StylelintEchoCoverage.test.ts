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
        // Allow when wrapped in var(--sn-easing-foo, cubic-bezier(...))
        const allowedPattern = new RegExp(
          `var\\(--sn-easing-[^,]+,\\s*${match.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          )}\\)`
        );
        if (!allowedPattern.test(content)) {
          offending.push(`${file}: ${match}`);
        }
      });
    });

    expect(offending).toEqual([]);
  });
});
