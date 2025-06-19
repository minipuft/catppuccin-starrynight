// @ts-nocheck
import fs from "fs";
import path from "path";

describe("Style token coverage – no raw cubic-bezier literals", () => {
  const files = [
    "src/features/_sn_atmospheric.scss",
    "src/features/_sn_stars.scss",
  ];

  files.forEach((file) => {
    it(`${file} should not contain un-tokenised cubic-bezier`, () => {
      const content = fs.readFileSync(
        path.resolve(__dirname, "..", file),
        "utf8"
      );
      const regex = /cubic-bezier\(0\.4, 0, 0\.2, 1\)/;
      expect(regex.test(content)).toBe(false);
    });
  });
});
